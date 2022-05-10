start "ui" cmd.exe /k "npm run start -w=ui"
start "server-main" cmd.exe /k "npm run main -w=node_servers"
start "server-metadata" cmd.exe /k "npm run metadata -w=node_servers"
start "server-text" cmd.exe /k "cd text_server && mix run --no-halt"
start "server-people" cmd.exe /k "cd .\people_server\build\bin\ && .\peopleServer.exe"
start "server-weather" cmd.exe /k "cd weather_server\env\Scripts && activate && cd ..\..\.. && python weather_server"

