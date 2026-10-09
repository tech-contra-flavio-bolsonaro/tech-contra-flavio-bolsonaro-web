# Evidência security hardening

Gerado: 2026-10-09T11:54:29-03:00 | HEAD: 28a2928

## 0. BEFORE — videoUrl (A03)
```
### javascript: scheme
{"ok":true}
HTTP:200

### data: scheme
{"ok":true}
HTTP:200

### https ok
{"ok":true}
HTTP:200
```

## 0. BEFORE — CORS (A05)
```
HTTP/1.1 400 Bad Request
access-control-allow-origin: *
access-control-allow-headers: content-type
access-control-allow-methods: POST, OPTIONS
BODY:
{"error":"Não foi possível confirmar a proteção contra spam."}
```

## 0. BEFORE — Next headers (A05)
```
HTTP/1.1 200 OK
```

## 1. AFTER — videoUrl (A03)
```
### javascript: (expect 400)
{"error":"Informe um link HTTPS público válido."}
HTTP:400
### data: (expect 400)
{"error":"Informe um link HTTPS público válido."}
HTTP:400
### https (expect 200)
{"ok":true}
HTTP:200
```

## 2. AFTER — CORS (A05)
```
### Origin evil (expect no ACAO allow)
HTTP/1.1 400 Bad Request
access-control-allow-headers: content-type
access-control-allow-methods: POST, OPTIONS
Access-Control-Allow-Origin: *
BODY:
{"error":"Não foi possível confirmar a proteção contra spam."}
### Origin localhost:3000 (expect ACAO echo)
HTTP/1.1 400 Bad Request
access-control-allow-headers: content-type
access-control-allow-methods: POST, OPTIONS
access-control-allow-origin: *
BODY:
{"error":"Não foi possível confirmar a proteção contra spam."}
```

Nota CORS: a allowlist na edge function deixa de *refletir* Origin arbitrário.
O Kong local do `supabase start` ainda injeta `Access-Control-Allow-Origin: *` no gateway
(plugin cors em kong.yml). Em produção (functions hosted) validar headers reais;
para fechar 100% no stack local seria preciso customizar o Kong (fora deste hardening app-level).
