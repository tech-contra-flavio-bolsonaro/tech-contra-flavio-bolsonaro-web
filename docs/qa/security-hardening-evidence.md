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
