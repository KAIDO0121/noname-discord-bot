// ref: https://medium.com/learn-or-die/%E5%A5%BD-pm2-%E4%B8%8D%E7%94%A8%E5%97%8E-fc7434cc8821
module.exports = {
  apps: [
    // First application
    {
        // App 名稱
        name: 'app1',
        // 執行服務的入口檔案
        script: './server.js',
        // 你的服務所在位置
        cwd: 'var/www/yourApp/',
        // 分為 cluster 以及 fork 模式
        exec_mode: 'cluster',
        // 只適用於 cluster 模式，程序啟動數量
        instances: 0,
        // 適合開發時用，檔案一有變更就會自動重啟
        watch: false,
        // 當佔用的 memory 達到 500M, 就自動重啟
        max_memory_restart: '500M',
        // 可以指定要啟動服務的 node 版本
        interpreter: '/root/.nvm/versions/node/v8.16.0/bin/node',
        // node 的額外參數
        // 格式可以是 array, 像是 "args": ["--toto=heya coco", "-d", "1"], 或是 string, 像是 "args": "--to='heya coco' -d 1"
        interpreter_args: "port=3001 sitename='first pm2 app'",
        // 同上
        node_args: "port=3001 sitename='first pm2 app'",
        // 'cron' 模式指定重啟時間，只支持 cluster 模式
        cron_restart: "0 17 * * *",
        // log 顯示時間
        time: true,
        // 可經由 CLI 帶入的參數
        args: '-a 13 -b 12',
        // 想要被忽略的檔案或資料夾, 支援正則，指定的檔案或資料夾如果內容有變更，服務將不會重啟
        // 格式可以是 array, 像是 "args": ["--toto=heya coco", "-d", "1"], 或是 string, 像是 "args": "--to='heya coco' -d 1"
        ignore_watch: ["[\/\\]\./", "node_modules"],
        // 支援 source_map, 預設 true, 細節可參考
        // http://pm2.keymetrics.io/docs/usage/source-map-support/
        // https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
        source_map_support: true,
        // instance_var, 詳見以下連結
        // http://pm2.keymetrics.io/docs/usage/environment/#specific-environment-variables
        instance_var: 'NODE_APP_INSTANCE',
        // log 的時間格式
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        // 錯誤 log 的指定位置
        error_file: '/var/log',
        // 正常輸出 log 的指定位置
        out_file: '/var/log',
        // 同一個 app 有多程序 id, 如果設定為 true 的話， 同 app 的 log 檔案將不會根據不同的程序 id 分割，會全部合在一起
        combine_logs: true,
        // 同上
        merge_logs: true,
        // pid file 指定位置, 預設 $HOME/.pm2/pid/app-pm_id.pid
        pid_file: 'user/.pm2/pid/app-pm_id.pid',
        // pm2 會根據此選項內的時間來判定程序是否有成功啟動
        // 格式可使用 number 或 string, number 的話， 3000 代表 3000 ms。 string 的話, 可使用 '1h' 代表一個小時, '5m' 代表五分鐘, '10s' 代表十秒
        min_uptime: '5',
        // 單位為 ms, 如果在該時間內 app 沒有聽 port 的話，強制重啟
        listen_timeout: 8000,
        // 當執行 reload 時，因為 graceful reload 會等到服務都沒有被存取了才會斷開，如果超過這個時間，強制斷開重啟
        // 細節可參考官方文件 http://pm2.keymetrics.io/docs/usage/signals-clean-restart/
        kill_timeout: 1600,
        // 一般來說，服務等待 listen 事件觸發後，執行 reload, 若此選項為 true, 則等待 'ready' message
        // 細節可參考官方文件 http://pm2.keymetrics.io/docs/usage/signals-clean-restart/
        wait_ready: false,
        // pm2 具有 crash 自動重啟的功能。 但若異常狀況重啟超過此選項的指定次數，則停止自動重啟功能。 異常與否的判定，預設為 1 秒，也就是說如果服務啟動不足一秒又立即重啟，則異常重啟次數 + 1。 若 min_uptime 選項有指定，則以 min_uptime 指定的最小正常啟動時間為標準來判斷是否為異常重啟
        // 細節可參考官方文件 http://pm2.keymetrics.io/docs/usage/signals-clean-restart/
        max_restarts: 10,
        // 單位為 ms, 預設為 0, 若有指定時間，則 app 會等待指定時間過後重啟
        restart_delay: 4000,
        // 預設為 true, 若設為 false, pm2 將會關閉自動重啟功能, 也就是說 app crash 之後將不會自動重啟
        autorestart: true,
        // 預設為 true, 預設執行 pm2 start app 時，只要 ssh key 沒問題， pm2 會自動比較 local 跟 remote, 看是否為最新的 commit，若否，會自動下載更新。 此功能有版本問題，需新版才支援
        vizion: true,
        // 進階功能，當使用 Keymetrics 的 dashboard 執行 pull 或 update 操作後，可以觸發執行的一系列指令
        post_update: ["npm install", "echo launching the app"],
        // defaults to false. if true, you can start the same script several times which is usually not allowed by PM2
        // 預設為 false, 如果設定為 true, 
        force: false,
        // 當不指定 env 時，會套用此 object 裡頭的環境變數, 例如 pm2 start ecosystem.js
        env: {
            COMMON_VARIABLE: 'true',
            NODE_ENV: '',
            ID: '44'
        },
        // 當有指定 env 時，會套用此 object 裡頭的環境變數, 例如 pm2 start ecosystem.js --env production
        env_production: {
            NODE_ENV: 'production',
            ID: '55'
        },
        // 同上
        env_development: {
            NODE_ENV: 'development'
        }
    },
    // 第二個 app, 很多資訊上面有介紹過的就不再重複
    {
        name: 'app2',
        script: 'server.js',
        // 預設模式，可應用在其他語言, cluster 只可用在 node.js
        exec_mode: 'fork',
        instances: 0,
        watch: false,
        max_memory_restart: '500M',
        interpreter: '/root/.nvm/versions/node/v8.16.0/bin/node',
        time: true,
        env: {
            COMMON_VARIABLE: 'true',
            NODE_ENV: ''
        },
        env_staging: {
            NODE_ENV: 'staging'
        },
        env_test: {
            NODE_ENV: 'test'
        }
    }
],
// 這一個區塊是部署的部分
deploy: {
    // production
    production: {
        // 要登入執行 pm2 的 user
        user: 'root',
        // 支援多個 host 部署
        host: ['host1', 'host2'],
        // remote 要檢查的 public key 的位置
        key: 'path/to/some.pem',
        // 要部署的分支
        ref: 'origin/master',
        // Git 倉庫位址
        repo: 'git@gitlab.com:user/yourProject.git',
        // 要部署到 server 上的資料夾路徑
        path: '/var/www/yourProjectName',
        // 如果 ssh 有設定好，從 local 連到 remote 端將不會再詢問是否將 remote 端的 public key 加到 known host
        "ssh_options": "StrictHostKeyChecking=no",
        // 在 pm2 要從 local 端連到 remote 端之前要執行的指令，可以多個指令，由 ; 分割，也可以指定 shell script 的檔案路徑
        "pre-setup": 'apt update -y; apt install git -y',
        // 當 pm2 在 remote 機器上將專案 clone 下來之後會執行的指令，同上，可以多個指令，由 ; 分割，也可以指定 shell script 的檔案路徑
        "post-setup": "ls -la",
        // 當 pm2 在 local 要連上 remote 部署之前 ，在 local 端所要執行的指令, 同上，可以多個指令，由 ; 分割，也可以指定 shell script 的檔案路徑
        "pre-deploy-local" : "echo 'This is a local executed command'",
        // 部署完成後, 所要執行的指令 同上，可以多個指令，由 ; 分割，也可以指定 shell script 的檔案路徑
        'post-deploy': 'sudo /root/.nvm/versions/node/v8.16.0/bin/npm install && sudo /root/.nvm/versions/node/v8.16.0/bin/npm rebuild && /root/.nvm/versions/node/v8.16.0/bin/pm2 reload ecosystem.config.js',
        env_production: {
             NODE_ENV: 'production'
        }
    }, 
    staging: {
        user: 'root',
        host: ['host3', 'host4'],
        ref: 'origin/staging',
        repo: 'git@gitlab.com:user/yourProject.git',
        path: '/var/www/yourProjectName',
        "ssh_options": "StrictHostKeyChecking=no",
        "pre-setup": 'apt update -y; apt install git -y',
        "post-setup": "ls -la",
        "pre-deploy-local" : "echo 'This is a local executed command'",
        'post-deploy': 'sudo /root/.nvm/versions/node/v8.16.0/bin/npm install && sudo /root/.nvm/versions/node/v8.16.0/bin/npm rebuild && /root/.nvm/versions/node/v8.16.0/bin/pm2 reload ecosystem.config.js',
        env_production: {
             NODE_ENV: 'staging'
        }
    },
},
};
