start "ui" cmd.exe /k "npm run start -w=ui"
start "server-main" cmd.exe /k "npm run main -w=node_servers"
start "server-metadata" cmd.exe /k "npm run metadata -w=node_servers"
start "server-text" cmd.exe /k "cd text_server && mix run --no-halt"