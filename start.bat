start "ui" cmd.exe /k "npm run start -w=ui"
start "server-main" cmd.exe /k "npm run main -w=node_servers"
start "server-metadata" cmd.exe /k "npm run metadata -w=node_servers"
start "server-text" cmd.exe /k "cd text_server && mix run --no-halt"
<<<<<<< HEAD
start "server-people" cmd.exe /k "cd .\people_server\build\bin\ && .\peopleServer.exe"
start "server-weather" cmd.exe /k "weather_server/env/Scripts/Activate.bat && python3 weather_server"

=======
start "server-weather" cmd.exe /k "weather_server/env/Scripts/Activate.bat && python3 -m ./weather_server"
start "server-people" cmd.exe /k "cd ./people_server/build/bin && ./peopleServer.exe"
>>>>>>> d3070bc71f24bbf65be3b52e72825acb3983cb43
