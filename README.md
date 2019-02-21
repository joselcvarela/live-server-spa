# live-server-spa
Run your SPA and reload browsers running it, calling GET /__internal/emitReload

## Usage
`live-server-spa [-p 8080] [-h 127.0.0.1] [--hard] public`
```
  - `-p or --port [port]` - define listening port
  - `-h or --hostname [hostname]` - define listening hostname addres (ip interface)
  - `-H or --hard` - define hard reloads for clients
  - `public` - define folder to serve your content. Must contain an `index.html` file.
```

## Caveats
Your public folder must **not** contain a file or folder called `__internal`
