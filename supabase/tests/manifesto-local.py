#!/usr/bin/env python3
"""Local Docker integration only. No secrets or contact fields are printed."""
import argparse, base64, hashlib, hmac, json, subprocess, time, urllib.error, urllib.parse, urllib.request, uuid
parser = argparse.ArgumentParser()
parser.add_argument('--runtime-container', default='vira-voto-issue67-supabase-1')
parser.add_argument('--db-container', default='supabase_db_bigtlgeteefbeatjmbdn')
args = parser.parse_args()
base = 'http://127.0.0.1:54321'
env_text = subprocess.check_output(['docker', 'exec', args.runtime_container, 'cat', '/runtime/supabase.env'], text=True)
env = dict(line.split('=', 1) for line in env_text.splitlines() if '=' in line)
env = {key: value.strip('"') for key, value in env.items()}
def jwt(role):
    encode = lambda value: base64.urlsafe_b64encode(json.dumps(value, separators=(',', ':')).encode()).decode().rstrip('=')
    body = encode({'alg':'HS256','typ':'JWT'}) + '.' + encode({'role':role,'iss':'supabase','exp':int(time.time())+300,'sub':'00000000-0000-4000-8000-000000000071'})
    sig = base64.urlsafe_b64encode(hmac.new(env['JWT_SECRET'].encode(), body.encode(), hashlib.sha256).digest()).decode().rstrip('=')
    return body+'.'+sig
def request(path, method='POST', fields=None, role=None, json_body=False):
    headers = {}
    if role:
        headers={'apikey': env['ANON_KEY'], 'Authorization':'Bearer '+(env['ANON_KEY'] if role=='anon' else jwt(role))}
    if fields is not None:
        data = json.dumps(fields).encode() if json_body else urllib.parse.urlencode(fields).encode()
        headers['Content-Type']='application/json' if json_body else 'application/x-www-form-urlencoded'
    else: data=None
    req=urllib.request.Request(base+path,data=data,method=method,headers=headers)
    try:
        with urllib.request.urlopen(req,timeout=25) as response:return response.status,response.read().decode()
    except urllib.error.HTTPError as error:return error.code,error.read().decode()
def sql(query):
    return subprocess.check_output(['docker','exec',args.db_container,'psql','-U','postgres','-d','postgres','-At','-v','ON_ERROR_STOP=1','-c',query],text=True).strip()
identifier = uuid.uuid4().hex
email = 'integration-'+identifier+'@example.invalid'
fields={'name':'Pessoa Fictícia Integração','email':' '+email.upper()+' ','phone':'(11) 99999-0000','work_area':'Teste fictício local','consent':'true','cf-turnstile-response':'test-'+identifier}
endpoint='/functions/v1/submit-manifesto'
status,result=request(endpoint,fields=fields)
assert status==200 and json.loads(result)=={'ok':True}, ('insert',status)
print('PASS real local endpoint insert: 200, generic response')
snapshot=sql("select md5(row_to_json(s)::text) from public.manifesto_signatures s where email='"+email+"'")
status,replay=request(endpoint,fields=fields)
assert status==400 and email not in replay, ('replay',status)
print('PASS persistent token replay denied')
duplicate=dict(fields,name='Outro Nome Fictício',phone='(21) 98888-0000',work_area='Outra área fictícia',**{'cf-turnstile-response':'duplicate-'+uuid.uuid4().hex})
status,second=request(endpoint,fields=duplicate)
assert status==200 and second==result, ('duplicate',status)
assert snapshot==sql("select md5(row_to_json(s)::text) from public.manifesto_signatures s where email='"+email+"'")
assert sql("select count(*)=1 and bool_and(phone='+5511999990000' and consent and manifesto_version='2026-10-09-v1' and consent_version='2026-10-09-v1' and signed_at is not null) from public.manifesto_signatures where email='"+email+"'")=='t'
print('PASS duplicate same response, one row, original data/timestamp retained; normalized contact and versions stored')
for override in [{'name':''},{'email':'invalid'},{'phone':'(20) 99999-0000'},{'phone':'99999-0000'},{'work_area':''},{'consent':'false'},{'consent':''},{'name':'x'*161},{'work_area':'x'*121},{'cf-turnstile-response':''}]:
    status,body=request(endpoint,fields=dict(fields,**override))
    assert status==400 and email not in body, ('validation',status)
print('PASS required/email/DDD/consent/limits/missing challenge validation via real endpoint')
status,_=request(endpoint,fields=dict(fields,name='x'*20000))
assert status in (400,413),('body limit',status)
assert request(endpoint,method='GET')[0]==405
assert request(endpoint,method='OPTIONS')[0]==200
print('PASS bounded body, methods and CORS preflight')
for role in ['anon','authenticated']:
    for table in ['manifesto_signatures','manifesto_challenges']:
        for method in ['GET','POST','PATCH','DELETE']:
            status,body=request('/rest/v1/'+table+('?' + ('id=eq.00000000-0000-4000-8000-000000000071' if table=='manifesto_signatures' else 'token_hash=eq.'+'a'*64) if method in ['PATCH','DELETE'] else ''),method=method,fields={} if method in ['POST','PATCH'] else None,role=role,json_body=True)
            assert status == (401 if role == 'anon' else 403),('direct access',role,table,method,status)
            assert email not in body
    status,_=request('/rest/v1/rpc/record_manifesto_signature',fields={'p_name':'Fictício','p_email':'deny@example.invalid','p_phone':'+5511999990000','p_work_area':'QA','p_consent':True,'p_manifesto_version':'2026-10-09-v1','p_consent_version':'2026-10-09-v1','p_token_hash':'a'*64},role=role,json_body=True)
    assert status == (401 if role == 'anon' else 403),('rpc access',role,status)
    print('PASS '+role+' direct SELECT/INSERT/UPDATE/DELETE + RPC denied on private signature/challenge tables')
assert sql("select bool_and(relrowsecurity) from pg_class where oid in ('public.manifesto_signatures'::regclass,'public.manifesto_challenges'::regclass)")=='t'
assert sql("select count(*) from pg_policies where tablename in ('manifesto_signatures','manifesto_challenges')")=='0'
print('PASS RLS enabled, zero public policies')
print('PASS all local integration checks; only fictitious .invalid records created')
