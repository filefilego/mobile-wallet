<template>
    <div>
        <div>
            <div style="position: absolute; left: 15px; z-index: 1000000; top: 15px;">
                <ion-menu-toggle>
                    <ion-icon size="large" style="cursor: pointer; color: #fff; " :icon="menuOutline"></ion-icon>
                </ion-menu-toggle>
            </div>
            <div v-if="loadingInterval" style="position: absolute; right: 15px; z-index: 1000000; top: 15px;">
                <ion-spinner style="color:#fff;" name="dots"></ion-spinner>
            </div>
            <div class="area" style="padding-bottom: 12px; padding-top: 21px; background-color: rgb(62, 21, 202); text-align: center;">
                <ul class="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <div>
                  <img style="height: 72px; background-color: white; width: 72px; border-radius: 50%;" src="/assets/icon.png" />
                </div>
                <div style="margin-top:2px;">
                    <span style="color: #fff; font-size: 30px;">{{balance}} FFG</span>
                </div>
                <div style="margin-top:2px;">
                    <span style="color: #fff; font-size: 25px; font-weight: bold;">≈ {{ convertToUSD }} USD</span>
                </div> 
                <div style="margin-top:2px;">
                  <ion-grid>
                  <ion-row>
                      <ion-col style="text-align: right;">
                          <ion-button id="open-send" fill="outline" style="width:100px; --border-color: #ffffff; color:#fff;">Send</ion-button>
                      </ion-col>
                      <ion-col size="auto">
                          <div style="width:90px;"></div>
                      </ion-col>
                      <ion-col style="text-align: left;">
                          <ion-button id="open-receive" fill="outline" style="width:100px; --border-color: #ffffff; color:#fff;">Receive</ion-button>
                      </ion-col>
                  </ion-row>
                  </ion-grid>
                </div>
          </div>

          <div v-if="loadingTransactions" style="padding:10px; text-align: center;">
            <div style="border:1px solid #d7d7d7; border-radius: 2px;">
                <div style="margin-top:20px;">
                    <span style=" font-size: 25px; font-weight: bold;">Loading your transactions</span>
                </div>
                <div style="margin-top:40px; padding:25px;">
                    <ion-progress-bar type="indeterminate"></ion-progress-bar>
                </div>
                <div style="margin-top:20px; padding-bottom: 100px;">
                    <!-- <ion-button @click="openUrl" fill="outline" style="font-weight:bold; width:270px; height:50px; --border-color: #3e15ca; background-color: #3e15ca; color: white;"> 
                    Buy FFG
                    <ion-icon slot="end" :icon="cashOutline"></ion-icon>
                    </ion-button> -->
                </div>
            </div>
          </div>
          <div v-else>
            <div v-if="transactions.length > 0">
                <ion-list>
                    <ion-item>
                        <span style="color: #000; font-size: 18px; font-weight: bold;">Recent transactions:</span>
                    </ion-item>
                    <ion-item v-for="tx in transactions">
                        <ion-icon v-if="tx.transaction.to == receiveAddress || tx.transaction.to == tx.transaction.from" style="font-size: 1.4em; color: #3e15ca;" :icon="arrowDownCircleOutline"></ion-icon>
                        <ion-label v-if="tx.transaction.to == receiveAddress || tx.transaction.to == tx.transaction.from" style="margin-left:10px; font-size:1.1em;">Received: <span style="color:#3e15ca; font-weight: bold;"> {{formatAmount(tx.transaction.value)}} FFG </span></ion-label>
                        
                        <ion-icon v-if="tx.transaction.from == receiveAddress && tx.transaction.to != tx.transaction.from" style="font-size: 1.4em; color: #3e15ca;" :icon="paperPlaneOutline"></ion-icon>
                        <ion-label v-if="tx.transaction.from == receiveAddress && tx.transaction.to != tx.transaction.from" style="margin-left:10px; font-size:1.1em;">Sent: <span style="color:#3e15ca; font-weight: bold;"> {{formatAmount(tx.transaction.value)}}  FFG </span> <ion-badge v-if="tx.transaction.hash == lastTXSent" style="--background: #3e15ca;">New</ion-badge></ion-label>

                        
                        <div style="text-align: center;">
                            <span style="font-weight: bold; color:#000;">{{ formatTimestamp(tx.timestamp).day }}</span>
                            <br />
                            <span style="font-weight: bold; color:#3e15ca;">{{ formatTimestamp(tx.timestamp).month }}</span>
                        </div>
                        <ion-icon @click="openTxModal(tx)" style="font-size: 1.4em; color: #000; margin-left:10px;" :icon="ellipsisVerticalOutline"></ion-icon>
                    </ion-item>
                </ion-list>
            </div>
         
         
          <div style="padding:10px; text-align: center;" v-else>
            <div style="border:1px solid #d7d7d7; border-radius: 2px;">
                <div style="margin-top:50px;">
                    <span style=" font-size: 25px; font-weight: bold;">No transactions yet</span>
                </div>
                <div style="margin-top:18px;">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="150px" height="150px" version="1.1" viewBox="0 0 700 700">
                        <defs>
                        <symbol id="g" overflow="visible">
                        <path d="m3.6562-0.21875c-0.1875 0.09375-0.38672 0.16797-0.59375 0.21875-0.19922 0.050781-0.40625 0.078125-0.625 0.078125-0.66797 0-1.1992-0.17969-1.5938-0.54688-0.38672-0.375-0.57812-0.87891-0.57812-1.5156 0-0.64453 0.19141-1.1484 0.57812-1.5156 0.39453-0.375 0.92578-0.5625 1.5938-0.5625 0.21875 0 0.42578 0.027344 0.625 0.078125 0.20703 0.054687 0.40625 0.125 0.59375 0.21875v0.82812c-0.1875-0.125-0.375-0.21875-0.5625-0.28125-0.17969-0.0625-0.37109-0.09375-0.57812-0.09375-0.36719 0-0.65625 0.12109-0.875 0.35938-0.21094 0.23047-0.3125 0.55469-0.3125 0.96875 0 0.40625 0.10156 0.73047 0.3125 0.96875 0.21875 0.23047 0.50781 0.34375 0.875 0.34375 0.20703 0 0.39844-0.023437 0.57812-0.078125 0.1875-0.0625 0.375-0.16016 0.5625-0.29688z"/>
                        </symbol>
                        <symbol id="d" overflow="visible">
                        <path d="m2.6875-2.1719c-0.085938-0.039063-0.16797-0.070313-0.25-0.09375-0.085938-0.019531-0.16797-0.03125-0.25-0.03125-0.25 0-0.44531 0.085937-0.57812 0.25-0.125 0.15625-0.1875 0.38281-0.1875 0.67188v1.375h-0.96875v-2.9844h0.96875v0.48438c0.11328-0.19531 0.25-0.33594 0.40625-0.42188 0.16406-0.09375 0.35938-0.14062 0.57812-0.14062h0.10938c0.039063 0 0.09375 0.007812 0.15625 0.015625z"/>
                        </symbol>
                        <symbol id="c" overflow="visible">
                        <path d="m3.4375-1.5v0.26562h-2.2344c0.03125 0.23047 0.11328 0.40234 0.25 0.51562 0.13281 0.10547 0.32812 0.15625 0.57812 0.15625 0.20703 0 0.41406-0.023438 0.625-0.078125 0.20703-0.0625 0.42188-0.15625 0.64062-0.28125v0.73438c-0.21875 0.09375-0.44531 0.16406-0.67188 0.20312-0.23047 0.039062-0.45312 0.0625-0.67188 0.0625-0.54297 0-0.96484-0.13281-1.2656-0.40625-0.30469-0.28125-0.45312-0.67188-0.45312-1.1719 0-0.47656 0.14453-0.85938 0.4375-1.1406 0.30078-0.28125 0.70703-0.42188 1.2188-0.42188 0.46875 0 0.84375 0.14062 1.125 0.42188s0.42188 0.66406 0.42188 1.1406zm-0.96875-0.32812c0-0.17578-0.058594-0.31641-0.17188-0.42188-0.10547-0.11328-0.24219-0.17188-0.40625-0.17188-0.1875 0-0.33984 0.054687-0.45312 0.15625-0.11719 0.10547-0.1875 0.25-0.21875 0.4375z"/>
                        </symbol>
                        <symbol id="b" overflow="visible">
                        <path d="m1.7969-1.3438c-0.19922 0-0.35156 0.039062-0.45312 0.10938-0.09375 0.0625-0.14062 0.16406-0.14062 0.29688 0 0.11719 0.035156 0.21094 0.10938 0.28125 0.082031 0.0625 0.19531 0.09375 0.34375 0.09375 0.17578 0 0.32812-0.0625 0.45312-0.1875s0.1875-0.28516 0.1875-0.48438v-0.10938zm1.4688-0.35938v1.7031h-0.96875v-0.4375c-0.125 0.17969-0.27344 0.30859-0.4375 0.39062-0.15625 0.082031-0.35156 0.125-0.57812 0.125-0.3125 0-0.57031-0.085938-0.76562-0.26562-0.1875-0.1875-0.28125-0.42188-0.28125-0.70312 0-0.35156 0.11719-0.61328 0.35938-0.78125 0.23828-0.16406 0.61719-0.25 1.1406-0.25h0.5625v-0.0625c0-0.15625-0.0625-0.26562-0.1875-0.32812-0.11719-0.070312-0.29688-0.10938-0.54688-0.10938-0.21094 0-0.40234 0.023437-0.57812 0.0625-0.17969 0.042969-0.33984 0.10156-0.48438 0.17188v-0.71875c0.19531-0.050781 0.39844-0.085938 0.60938-0.10938 0.20703-0.03125 0.41406-0.046875 0.625-0.046875 0.53906 0 0.92969 0.10938 1.1719 0.32812 0.23828 0.21094 0.35938 0.55469 0.35938 1.0312z"/>
                        </symbol>
                        <symbol id="a" overflow="visible">
                        <path d="m1.5-3.8438v0.85938h0.98438v0.67188h-0.98438v1.2812c0 0.13672 0.023438 0.23047 0.078125 0.28125 0.0625 0.042969 0.17578 0.0625 0.34375 0.0625h0.48438v0.6875h-0.8125c-0.38672 0-0.65625-0.078125-0.8125-0.23438s-0.23438-0.42188-0.23438-0.79688v-1.2812h-0.46875v-0.67188h0.46875v-0.85938z"/>
                        </symbol>
                        <symbol id="j" overflow="visible">
                        <path d="m2.5-2.5469v-1.6094h0.95312v4.1562h-0.95312v-0.4375c-0.13672 0.17969-0.28125 0.30859-0.4375 0.39062-0.15625 0.082031-0.33984 0.125-0.54688 0.125-0.375 0-0.68359-0.14453-0.92188-0.4375-0.23047-0.28906-0.34375-0.67188-0.34375-1.1406 0-0.45703 0.11328-0.83203 0.34375-1.125 0.23828-0.28906 0.54688-0.4375 0.92188-0.4375 0.19531 0 0.375 0.042969 0.53125 0.125 0.16406 0.085938 0.31641 0.21484 0.45312 0.39062zm-0.64062 1.9375c0.20703 0 0.36328-0.070313 0.46875-0.21875 0.11328-0.15625 0.17188-0.37891 0.17188-0.67188 0-0.28125-0.058594-0.49219-0.17188-0.64062-0.10547-0.15625-0.26172-0.23438-0.46875-0.23438-0.19922 0-0.35547 0.078125-0.46875 0.23438-0.10547 0.14844-0.15625 0.35938-0.15625 0.64062 0 0.29297 0.050781 0.51562 0.15625 0.67188 0.11328 0.14844 0.26953 0.21875 0.46875 0.21875z"/>
                        </symbol>
                        <symbol id="i" overflow="visible">
                        <path d="m2.0469-0.60938c0.20703 0 0.36328-0.070313 0.46875-0.21875 0.11328-0.15625 0.17188-0.37891 0.17188-0.67188 0-0.28125-0.058594-0.49219-0.17188-0.64062-0.10547-0.15625-0.26172-0.23438-0.46875-0.23438-0.19922 0-0.35547 0.078125-0.46875 0.23438-0.10547 0.14844-0.15625 0.35938-0.15625 0.64062 0 0.29297 0.050781 0.51562 0.15625 0.67188 0.11328 0.14844 0.26953 0.21875 0.46875 0.21875zm-0.625-1.9375c0.125-0.17578 0.26562-0.30469 0.42188-0.39062 0.16406-0.082031 0.35156-0.125 0.5625-0.125 0.36328 0 0.66406 0.14844 0.90625 0.4375 0.23828 0.29297 0.35938 0.66797 0.35938 1.125 0 0.46875-0.12109 0.85156-0.35938 1.1406-0.24219 0.29297-0.54297 0.4375-0.90625 0.4375-0.21094 0-0.39844-0.042969-0.5625-0.125-0.15625-0.082031-0.29688-0.21094-0.42188-0.39062v0.4375h-0.96875v-4.1562h0.96875z"/>
                        </symbol>
                        <symbol id="h" overflow="visible">
                        <path d="m0.0625-2.9844h0.95312l0.8125 2.0156 0.6875-2.0156h0.95312l-1.2656 3.2656c-0.125 0.33203-0.27344 0.56641-0.4375 0.70312-0.16797 0.13281-0.39062 0.20312-0.67188 0.20312h-0.54688v-0.64062h0.29688c0.16406 0 0.28516-0.027344 0.35938-0.078125 0.070313-0.054688 0.12891-0.14062 0.17188-0.26562l0.03125-0.09375z"/>
                        </symbol>
                        <symbol id="f" overflow="visible">
                        <path d="m3.4688-1.8281v1.8281h-0.96875v-1.3906c0-0.25781-0.007812-0.4375-0.015625-0.53125-0.011719-0.10156-0.03125-0.17578-0.0625-0.21875-0.03125-0.0625-0.085937-0.10938-0.15625-0.14062-0.0625-0.039062-0.13281-0.0625-0.20312-0.0625-0.21094 0-0.37109 0.078125-0.48438 0.23438-0.10547 0.15625-0.15625 0.37109-0.15625 0.64062v1.4688h-0.96875v-4.1562h0.96875v1.6094c0.13281-0.17578 0.28516-0.30469 0.45312-0.39062 0.16406-0.082031 0.34375-0.125 0.53125-0.125 0.34375 0 0.60156 0.10938 0.78125 0.32812 0.1875 0.21094 0.28125 0.51172 0.28125 0.90625z"/>
                        </symbol>
                        <symbol id="s" overflow="visible">
                        <path d="m1.4219-0.4375v1.5781h-0.96875v-4.125h0.96875v0.4375c0.125-0.17578 0.26562-0.30469 0.42188-0.39062 0.16406-0.082031 0.35156-0.125 0.5625-0.125 0.36328 0 0.66406 0.14844 0.90625 0.4375 0.23828 0.29297 0.35938 0.66797 0.35938 1.125 0 0.46875-0.12109 0.85156-0.35938 1.1406-0.24219 0.29297-0.54297 0.4375-0.90625 0.4375-0.21094 0-0.39844-0.042969-0.5625-0.125-0.15625-0.082031-0.29688-0.21094-0.42188-0.39062zm0.625-1.9375c-0.19922 0-0.35547 0.078125-0.46875 0.23438-0.10547 0.14844-0.15625 0.35938-0.15625 0.64062 0 0.29297 0.050781 0.51562 0.15625 0.67188 0.11328 0.14844 0.26953 0.21875 0.46875 0.21875 0.20703 0 0.36328-0.070313 0.46875-0.21875 0.11328-0.15625 0.17188-0.37891 0.17188-0.67188 0-0.28125-0.058594-0.49219-0.17188-0.64062-0.10547-0.15625-0.26172-0.23438-0.46875-0.23438z"/>
                        </symbol>
                        <symbol id="r" overflow="visible">
                        <path d="m2.4219-4.1562v0.625h-0.51562c-0.13672 0-0.23438 0.027344-0.29688 0.078125-0.054687 0.054687-0.078125 0.13672-0.078125 0.25v0.21875h0.82812v0.67188h-0.82812v2.3125h-0.95312v-2.3125h-0.46875v-0.67188h0.46875v-0.21875c0-0.32031 0.085937-0.5625 0.26562-0.71875 0.1875-0.15625 0.47266-0.23438 0.85938-0.23438z"/>
                        </symbol>
                        <symbol id="e" overflow="visible">
                        <path d="m1.875-2.375c-0.21094 0-0.37109 0.078125-0.48438 0.23438-0.10547 0.14844-0.15625 0.35938-0.15625 0.64062 0 0.29297 0.050781 0.51562 0.15625 0.67188 0.11328 0.14844 0.27344 0.21875 0.48438 0.21875 0.20703 0 0.36719-0.070313 0.48438-0.21875 0.11328-0.15625 0.17188-0.37891 0.17188-0.67188 0-0.28125-0.058594-0.49219-0.17188-0.64062-0.11719-0.15625-0.27734-0.23438-0.48438-0.23438zm0-0.6875c0.51953 0 0.92188 0.14062 1.2031 0.42188 0.28906 0.27344 0.4375 0.65234 0.4375 1.1406 0 0.5-0.14844 0.89062-0.4375 1.1719-0.28125 0.27344-0.68359 0.40625-1.2031 0.40625-0.51172 0-0.91406-0.13281-1.2031-0.40625-0.29297-0.28125-0.4375-0.67188-0.4375-1.1719 0-0.48828 0.14453-0.86719 0.4375-1.1406 0.28906-0.28125 0.69141-0.42188 1.2031-0.42188z"/>
                        </symbol>
                        <symbol id="q" overflow="visible">
                        <path d="m3.2344-2.5c0.11328-0.17578 0.25391-0.3125 0.42188-0.40625 0.16406-0.10156 0.35156-0.15625 0.5625-0.15625 0.33203 0 0.58594 0.10938 0.76562 0.32812 0.1875 0.21094 0.28125 0.51172 0.28125 0.90625v1.8281h-0.96875v-1.5625c0.007813-0.019531 0.015625-0.039062 0.015625-0.0625v-0.10938c0-0.21875-0.03125-0.375-0.09375-0.46875s-0.16406-0.14062-0.29688-0.14062c-0.1875 0-0.33594 0.078125-0.4375 0.23438-0.09375 0.14844-0.14062 0.35938-0.14062 0.64062v1.4688h-0.96875v-1.5625c0-0.33203-0.03125-0.54688-0.09375-0.64062-0.054688-0.09375-0.15234-0.14062-0.29688-0.14062-0.17969 0-0.32031 0.078125-0.42188 0.23438-0.09375 0.14844-0.14062 0.35938-0.14062 0.64062v1.4688h-0.96875v-2.9844h0.96875v0.4375c0.11328-0.17578 0.24219-0.30469 0.39062-0.39062 0.15625-0.082031 0.32812-0.125 0.51562-0.125 0.20703 0 0.39062 0.054688 0.54688 0.15625 0.15625 0.09375 0.27344 0.23047 0.35938 0.40625z"/>
                        </symbol>
                        <symbol id="p" overflow="visible">
                        <path d="m0.5-3.9844h1.1562l1.4375 2.7344v-2.7344h0.98438v3.9844h-1.1562l-1.4375-2.7344v2.7344h-0.98438z"/>
                        </symbol>
                        <symbol id="o" overflow="visible">
                        <path d="m0.42188-1.1719v-1.8125h0.96875v0.29688 0.60938 0.48438c0 0.24219 0.003906 0.41797 0.015625 0.53125 0.007812 0.10547 0.03125 0.17969 0.0625 0.21875 0.039062 0.0625 0.09375 0.11719 0.15625 0.15625 0.0625 0.03125 0.13281 0.046875 0.21875 0.046875 0.19531 0 0.35156-0.078125 0.46875-0.23438 0.11328-0.15625 0.17188-0.36719 0.17188-0.64062v-1.4688h0.95312v2.9844h-0.95312v-0.4375c-0.14844 0.17969-0.30469 0.30859-0.46875 0.39062-0.15625 0.082031-0.33594 0.125-0.53125 0.125-0.34375 0-0.60938-0.10156-0.79688-0.3125-0.17969-0.21875-0.26562-0.53125-0.26562-0.9375z"/>
                        </symbol>
                        <symbol id="n" overflow="visible">
                        <path d="m3.4688-1.8281v1.8281h-0.96875v-1.3906c0-0.25781-0.007812-0.4375-0.015625-0.53125-0.011719-0.10156-0.03125-0.17578-0.0625-0.21875-0.03125-0.0625-0.085937-0.10938-0.15625-0.14062-0.0625-0.039062-0.13281-0.0625-0.20312-0.0625-0.21094 0-0.37109 0.078125-0.48438 0.23438-0.10547 0.15625-0.15625 0.37109-0.15625 0.64062v1.4688h-0.96875v-2.9844h0.96875v0.4375c0.13281-0.17578 0.28516-0.30469 0.45312-0.39062 0.16406-0.082031 0.34375-0.125 0.53125-0.125 0.34375 0 0.60156 0.10938 0.78125 0.32812 0.1875 0.21094 0.28125 0.51172 0.28125 0.90625z"/>
                        </symbol>
                        <symbol id="m" overflow="visible">
                        <path d="m0.5-3.9844h1.7031c0.50781 0 0.89844 0.11719 1.1719 0.34375 0.26953 0.21875 0.40625 0.53906 0.40625 0.95312 0 0.41797-0.13672 0.74219-0.40625 0.96875-0.27344 0.21875-0.66406 0.32812-1.1719 0.32812h-0.67188v1.3906h-1.0312zm1.0312 0.75v1.1094h0.5625c0.19531 0 0.34766-0.046875 0.45312-0.14062 0.11328-0.10156 0.17188-0.24219 0.17188-0.42188 0-0.17578-0.058594-0.3125-0.17188-0.40625-0.10547-0.09375-0.25781-0.14062-0.45312-0.14062z"/>
                        </symbol>
                        <symbol id="l" overflow="visible">
                        <path d="m0.45312-2.9844h0.96875v2.9375c0 0.39453-0.10156 0.69531-0.29688 0.90625-0.1875 0.21875-0.46484 0.32812-0.82812 0.32812h-0.48438v-0.64062h0.17188c0.17578 0 0.29688-0.042969 0.35938-0.125 0.070312-0.074219 0.10938-0.23047 0.10938-0.46875zm0-1.1719h0.96875v0.78125h-0.96875z"/>
                        </symbol>
                        <symbol id="k" overflow="visible">
                        <path d="m2.875-2.8906v0.76562c-0.125-0.082031-0.25781-0.14453-0.39062-0.1875-0.13672-0.039062-0.27344-0.0625-0.40625-0.0625-0.27344 0-0.48047 0.078125-0.625 0.23438-0.14844 0.15625-0.21875 0.37109-0.21875 0.64062 0 0.28125 0.070313 0.5 0.21875 0.65625 0.14453 0.15625 0.35156 0.23438 0.625 0.23438 0.14453 0 0.28516-0.019531 0.42188-0.0625 0.13281-0.039063 0.25781-0.10938 0.375-0.20312v0.78125c-0.14844 0.0625-0.29688 0.10156-0.45312 0.125-0.15625 0.03125-0.3125 0.046875-0.46875 0.046875-0.54297 0-0.96484-0.13281-1.2656-0.40625-0.30469-0.28125-0.45312-0.67188-0.45312-1.1719 0-0.48828 0.14844-0.86719 0.45312-1.1406 0.30078-0.28125 0.72266-0.42188 1.2656-0.42188 0.15625 0 0.3125 0.015625 0.46875 0.046875 0.15625 0.023437 0.30469 0.0625 0.45312 0.125z"/>
                        </symbol>
                        </defs>
                        <g>
                        <path d="m605.21 163.72c-7.5312-8.8008-17.957-14.633-29.398-16.438l-128.89-20.355c-0.22656-0.035157-0.45313-0.054688-0.67969-0.054688h-74.352l-0.023438-9.1875c4.9375-1.0156 9.375-3.7031 12.562-7.6055 3.1875-3.9062 4.9297-8.793 4.9375-13.832v-23.57c5.1523-1.8906 9.5977-5.3242 12.73-9.832 3.1289-4.5039 4.7969-9.8672 4.7695-15.355v-12.492c0-1.1602-0.46094-2.2734-1.2812-3.0938s-1.9336-1.2812-3.0938-1.2812h-19.93c-3.5117-0.003906-6.9805-0.79297-10.148-2.3086l-6.8594-3.2812c-9.9922-4.7812-21.742-4.0977-31.117 1.8047-9.375 5.9062-15.066 16.211-15.07 27.289v28.996c0.003906 6.25 3.3359 12.023 8.75 15.148v28.602h-74.375c-0.22656 0-0.45312 0.019531-0.67969 0.054688l-128.89 20.355c-13.66 2.1484-25.758 10.012-33.266 21.625-7.5078 11.609-9.7188 25.871-6.0742 39.207l49.719 182.31c0.62891 2.3242 2.1836 4.2852 4.3047 5.4219 2.1172 1.1406 4.6133 1.3555 6.8984 0.59375l18.855-6.2891c3.5859-1.1758 6.0078-4.5273 6.0039-8.3008v-24.875l3.9258 3.5781c0.94922 0.85547 2.0586 1.5195 3.2617 1.957 0.41406 0.33984 0.84375 0.6875 1.2695 1.0156l-0.003906 0.003906c20.133 15.777 44.738 24.789 70.297 25.758v144.46c0 1.1602 0.46094 2.2734 1.2812 3.0938s1.9336 1.2812 3.0938 1.2812h87.5c1.1602 0 2.2734-0.46094 3.0938-1.2812s1.2812-1.9336 1.2812-3.0938v-100.62h8.75v100.62c0 1.1602 0.46094 2.2734 1.2812 3.0938s1.9336 1.2812 3.0938 1.2812h87.5c1.1602 0 2.2734-0.46094 3.0938-1.2812s1.2812-1.9336 1.2812-3.0938v-144.47c26.098-0.96484 51.184-10.344 71.508-26.742 1.2266-0.4375 2.3516-1.1094 3.3164-1.9805l3.9258-3.5781v24.875c-0.003906 3.7695 2.4141 7.1172 5.9922 8.3008l18.855 6.2773h0.003906c2.2812 0.75781 4.7734 0.54687 6.8984-0.57813 2.1211-1.1367 3.6797-3.0977 4.3125-5.4141l49.723-182.3-0.003906-0.003906c4.2422-15.535 0.51953-32.16-9.9414-44.406zm-268.34-89.348c2.2891-0.011719 4.4883 0.88672 6.1133 2.4922 0.92188 0.90234 2.1875 1.3516 3.4688 1.2383 1.2812-0.11719 2.4492-0.78906 3.1914-1.8398 1.9336-2.7617 3.3164-5.875 4.0703-9.1641l17.742 5.9062c2.6914 0.90625 5.5117 1.375 8.3555 1.3906 0.26172 0 0.53516-0.011719 0.80859-0.023438v21.875c-0.007812 7.2461-5.8789 13.117-13.125 13.125-5.375 0.003906-10.656-1.4062-15.312-4.0898-1.0078-0.64062-2.2305-0.83984-3.3867-0.55859-1.1602 0.28516-2.1523 1.0273-2.75 2.0586-0.59375 1.0352-0.74609 2.2656-0.41406 3.4102 0.33594 1.1445 1.1211 2.1055 2.1758 2.6562 4.7031 2.7148 9.918 4.4219 15.312 5.0117l0.023438 11.57-13.148 13.125-13.125-13.125v-33.938c0.003906-1.8555-1.168-3.5117-2.9219-4.125-4.0117-1.4219-6.418-5.5312-5.6992-9.7266 0.72266-4.1992 4.3633-7.2695 8.6211-7.2695zm-154.89 279.57c-0.19531 0.26172-0.50391 0.41016-0.83203 0.40234-0.26562 0.011719-0.52734-0.089843-0.71875-0.27344l-11.242-10.238-0.003906 0.003906c-1.2812-1.1641-3.1289-1.4648-4.7109-0.76562-1.5859 0.70312-2.6055 2.2695-2.6055 4v34.77l-18.867 6.2891-49.723-182.32c-2.9883-10.938-1.1797-22.633 4.9766-32.156 6.1562-9.5195 16.078-15.969 27.277-17.73l35.141-5.5469 8.9688 42.953-21.625 3.5977h0.003906c-1.2031 0.20312-2.2695 0.89844-2.9375 1.918-0.67188 1.0234-0.88281 2.2773-0.58203 3.4648l37.68 150.73v-0.003907c0.089844 0.31641 0.015625 0.66016-0.19922 0.91016zm67.387-165.04v149.37l-4.6367 1.8594c-17.426 6.9609-36.32 9.4414-54.949 7.207l-35.648-142.57zm1.9258 191.66c-22.531-0.51953-44.387-7.7891-62.738-20.867 0.10938-0.12109 0.21875-0.23047 0.31641-0.35938v-0.003906c0.73047-0.92188 1.2852-1.9688 1.6289-3.0938 19.523 2.0391 39.25-0.69531 57.477-7.9727l6.6055-2.6484h17.676zm133.24-34.812-30.832 49.316h-0.003907c-0.80078 1.2773-2.1992 2.0508-3.707 2.0508s-2.9062-0.77344-3.707-2.0508l-30.832-49.316c-0.49609-0.79687-0.72266-1.7266-0.64844-2.6602l0.49219-6.2227h-57.18v-153.12c0-1.2891-0.5625-2.5117-1.5469-3.3438-0.98047-0.83203-2.2812-1.1875-3.5508-0.97656l-74.746 12.457-8.9453-42.875 84.754-13.387h76.594l11.934 11.922-26.754 13.375-15.27-15.27v0.003906c-1.707-1.7109-4.4805-1.7109-6.1875 0-1.7109 1.707-1.7109 4.4805 0 6.1875l17.5 17.5c1.332 1.3359 3.3672 1.6641 5.0508 0.82031l13.586-6.793 6.2461 12.492-7.5273 95.387-5.1836 65.625-0.42578 5.4688 26.348 42.164 26.348-42.164-0.42578-5.4688-5.1836-65.625-7.5352-95.387 6.2109-12.523 13.629 6.8242c0.60938 0.30078 1.2773 0.46094 1.957 0.46094 1.1602 0.003906 2.2734-0.45703 3.0938-1.2812l17.5-17.5c1.7109-1.707 1.7109-4.4805 0-6.1875-1.707-1.7109-4.4805-1.7109-6.1875 0l-15.27 15.27-26.742-13.367 11.941-11.934h76.574l84.754 13.387-8.9453 42.875-74.746-12.457c-1.2695-0.21094-2.5703 0.14453-3.5508 0.97656-0.98438 0.83203-1.5469 2.0547-1.5469 3.3438v153.12h-57.18l0.49219 6.2227c0.074219 0.93359-0.15234 1.8633-0.64844 2.6602zm161.32-140.98-35.648 142.58c-18.629 2.2227-37.523-0.25781-54.949-7.2188l-4.6367-1.8594v-149.37zm-97.16 175.79-20.965-34.945h17.676l6.6055 2.6484c18.215 7.3086 37.945 10.043 57.465 7.9609 0.35547 1.125 0.91016 2.1797 1.6406 3.1055 0.097656 0.13281 0.20703 0.24219 0.30469 0.35156-18.336 13.102-40.195 20.375-62.727 20.879zm158.02-174.75-49.711 182.32-18.879-6.2891v-34.773c0-1.7305-1.0195-3.2969-2.6055-4-1.582-0.69922-3.4297-0.39844-4.7109 0.76562l-11.242 10.238-0.003906-0.003906c-0.19922 0.17578-0.45312 0.27344-0.71875 0.27344-0.32812 0.007813-0.63672-0.14062-0.83203-0.40234-0.21484-0.25-0.28906-0.59375-0.19922-0.91016l37.68-150.73v0.003906c0.30078-1.1875 0.089843-2.4414-0.58203-3.4648-0.66797-1.0195-1.7344-1.7148-2.9375-1.918l-21.625-3.5977 8.9688-42.953 35.141 5.5469h0.003907c11.199 1.7656 21.121 8.2148 27.277 17.738 6.1562 9.5234 7.9648 21.219 4.9766 32.156z"/>
                        <path d="m206.91 408.16-8.75 8.75c-1.7109 1.707-1.7109 4.4805 0 6.1875 1.707 1.7109 4.4805 1.7109 6.1875 0l8.75-8.75c1.7109-1.707 1.7109-4.4805 0-6.1875-1.707-1.7109-4.4805-1.7109-6.1875 0z"/>
                        <path d="m227.5 411.25c-2.418 0-4.375 1.957-4.375 4.375v13.125c0 2.418 1.957 4.375 4.375 4.375s4.375-1.957 4.375-4.375v-13.125c0-1.1602-0.46094-2.2734-1.2812-3.0938s-1.9336-1.2812-3.0938-1.2812z"/>
                        <path d="m205.62 393.75c0-1.1602-0.46094-2.2734-1.2812-3.0938s-1.9336-1.2812-3.0938-1.2812h-13.125c-2.418 0-4.375 1.957-4.375 4.375s1.957 4.375 4.375 4.375h13.125c1.1602 0 2.2734-0.46094 3.0938-1.2812s1.2812-1.9336 1.2812-3.0938z"/>
                        <path d="m493.09 416.91c-1.707-1.7109-4.4805-1.7109-6.1875 0-1.7109 1.707-1.7109 4.4805 0 6.1875l8.75 8.75c1.707 1.7109 4.4805 1.7109 6.1875 0 1.7109-1.707 1.7109-4.4805 0-6.1875z"/>
                        <path d="m472.5 420c-2.418 0-4.375 1.957-4.375 4.375v13.125c0 2.418 1.957 4.375 4.375 4.375s4.375-1.957 4.375-4.375v-13.125c0-1.1602-0.46094-2.2734-1.2812-3.0938s-1.9336-1.2812-3.0938-1.2812z"/>
                        <path d="m511.88 398.12h-13.125c-2.418 0-4.375 1.957-4.375 4.375s1.957 4.375 4.375 4.375h13.125c2.418 0 4.375-1.957 4.375-4.375s-1.957-4.375-4.375-4.375z"/>  
                        </g>
                        </svg>
                </div>
                <div style="margin-top:2px; padding-bottom: 65px;">
                    <ion-button @click="openUrl" fill="outline" style="font-weight:bold; width:270px; height:50px; --border-color: #3e15ca; background-color: #3e15ca; color: white;"> 
                    Buy FFG
                    <ion-icon slot="end" :icon="cashOutline"></ion-icon>
                    </ion-button>
                </div>
            </div>
          </div>
        </div>

        </div>


      <ion-modal ref="modal" trigger="open-send" @willDismiss="onWillDismiss">
            <ion-header>
                <ion-toolbar style="--background: #3e15ca;">
                <ion-title style="color: white;">Send FFG</ion-title>
                <ion-buttons style="color: white;" slot="end">
                    <ion-button @click="cancel()">Close</ion-button>
                </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <div class="area" style="padding-bottom: 12px; padding-top: 21px; background-color: rgb(62, 21, 202); text-align: center;">
                    <ul class="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div>
                    <img style="height: 72px; background-color: white; width: 72px; border-radius: 50%;" src="/assets/icon.png" />
                    </div>
                    <div style="margin-top:2px;">
                        <span style="color: #fff; font-size: 30px;">Current Balance:</span>
                    </div>
                    <div style="margin-top:2px;">
                        <span style="color: #fff; font-size: 25px; font-weight: bold;">{{balance}} FFG</span>
                    </div>
                </div>
                <div style="border: 1px solid #dbdbdb; border-radius: 4px; padding:20px;">
                <ion-input @ionBlur="markAddressTouched" ref="inputAddress" error-text="Invalid Address" @ionInput="validateAddress" v-model="toAddress" label="Address" label-placement="floating" fill="outline" placeholder="Enter the destination address" type="text"></ion-input>
                <br />
                <ion-input @ionBlur="markAmountTouched" ref="inputAmount" error-text="Invalid Amount" @ionInput="validateAmount" v-model="toValue" label="Amount" label-placement="floating" fill="outline" placeholder="Enter the FFG amount to send e.g 0.1" type="text"></ion-input>
                <br />
                <ion-input @ionBlur="markFeesTouched" ref="inputFees" error-text="Invalid Fees Amount" @ionInput="validateFees" v-model="toFees" label="Transaction Fees" label-placement="floating" fill="outline" placeholder="Enter the transaction fees amount" type="text"></ion-input>
                <br />
                <ion-text>We recommend utilizing the default transaction fees of <span style="font-weight: bold;"> 0.001 FFG </span></ion-text>
                
                <br />
                <br />
                <ion-button :disabled="submitTx" @click="submit" fill="outline" style="font-weight:bold; width:100%; height:50px; --border-color: #3e15ca; background-color: #3e15ca; color: white;"> 
                  Send
                  <ion-icon slot="end" :icon="paperPlaneOutline"></ion-icon>
                </ion-button>
                
              </div>
            </ion-content>
        </ion-modal>

        <ion-modal ref="modalReceive" trigger="open-receive" @willDismiss="onWillDismiss">
            <ion-header>
                <ion-toolbar style="--background: #3e15ca;">
                <ion-title style="color: white;">Receive FFG</ion-title>
                <ion-buttons style="color: white;" slot="end">
                    <ion-button @click="cancelReceive()">Close</ion-button>
                </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <div class="area" style="padding-bottom: 12px; padding-top: 21px; background-color: rgb(62, 21, 202); text-align: center;">
                    <ul class="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <div>
                    <img style="height: 72px; background-color: white; width: 72px; border-radius: 50%;" src="/assets/icon.png" />
                    </div>
                    <div style="margin-top:2px;">
                        <span style="color: #fff; font-size: 30px;">Wallet Address</span>
                    </div>
                    <div style="margin-top:2px;">
                        <!-- <span style="color: #fff; font-size: 25px; font-weight: bold;">0.000000000000001 FFG</span> -->
                    </div>
                </div>
                <div style="border: 1px solid #dbdbdb; border-radius: 4px; padding:20px;">
                <ion-input readonly v-model="receiveAddress" label="Your Address" label-placement="floating" fill="outline" type="text"></ion-input>
                <br />
                
                <ion-button @click="copyAddressToClipboard" fill="outline" style="font-weight:bold; width:100%; height:50px; --border-color: #3e15ca; background-color: #3e15ca; color: white;"> 
                  Copy Address
                  <ion-icon slot="end" :icon="copyOutline"></ion-icon>
                </ion-button>
                
              </div>
            </ion-content>
        </ion-modal>

        <ion-modal ref="modalInfo" @willDismiss="onWillDismiss">
            <ion-header>
                <ion-toolbar style="--background: #3e15ca;">
                <ion-title style="color: white;">Transaction info</ion-title>
                <ion-buttons style="color: white;" slot="end">
                    <ion-button @click="cancelTXInfo()">Close</ion-button>
                </ion-buttons>
                </ion-toolbar>
            </ion-header>
            <ion-content class="ion-padding">
                <div class="area" style="padding-bottom: 12px; padding-top: 21px; background-color: rgb(62, 21, 202); text-align: center;">
                    <div style="margin-top:2px;">
                        <span style="color: #fff; font-size: 30px;">Transaction:</span>
                    </div>
                    <div style="margin-top:2px;">
                        <!-- <span style="color: #fff; font-size: 25px; font-weight: bold;">0.000000000000001 FFG</span> -->
                    </div>
                </div>
                <div style="border: 1px solid #dbdbdb; border-radius: 4px; padding:20px;">
                    <span style="color: #000; font-weight: bold;">Block </span> {{tmpTXInfo.block_number}}
                    <br /> <br />
                    <span style="color: #000; font-weight: bold;">Time </span> {{formatTimestampHuman(tmpTXInfo.timestamp)}}
                    <br /> <br />
                    <span style="color: #000; font-weight: bold;">Nounce </span> {{tmpTXInfo.transaction.nounce}}
                    <br /> <br />
                    <span style="color: #000; font-weight: bold;">From </span> {{tmpTXInfo.transaction.from}}
                    <br /> <br />
                    <span style="color: #000; font-weight: bold;">To </span> {{tmpTXInfo.transaction.to}}
                    <br /> <br />
                    <span style="color: #000; font-weight: bold;">Value </span> {{formatAmount(tmpTXInfo.transaction.value)}} FFG
                    <br /> <br />
                    <span style="color: #000; font-weight: bold;">Fees </span> {{formatAmount(tmpTXInfo.transaction.transaction_fees)}} FFG
                    <br /> <br />
                    <span style="color: #000; font-weight: bold;">Hash </span> {{tmpTXInfo.transaction.hash}}
                    <br /> <br />
                </div>
            </ion-content>
        </ion-modal>

        <ion-alert
            :is-open="isAlertOpen"
            sub-header="Error"
            :message="networkErrorMessage"
            :buttons="alertButtons"
            @didDismiss="setIsAlertOpen(false)"
        ></ion-alert>


    </div>
  </template>
  
  <script>
  import { IonBadge, IonProgressBar, IonSpinner, IonMenuToggle, toastController, IonRange,IonModal, IonButtons, IonGrid, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonInput, IonButton, IonIcon, IonText, IonAlert, IonCol, IonRow, alertController, IonItem, IonLabel, IonList, IonListHeader} from '@ionic/vue';
  import {SignTransaction} from "../key.js"
  import {  menuOutline, keyOutline, arrowDownCircleOutline, paperPlaneOutline, copyOutline, ellipsisVerticalOutline, cashOutline } from 'ionicons/icons';
  import { Clipboard } from '@capacitor/clipboard';
  import { ref } from 'vue';
  import { globalState } from '../store';
  import axios from 'axios'
  import { Browser } from '@capacitor/browser';
  import numberToBN from "number-to-bn";

  import { Units } from "../unit.js"
  import BigNumber from 'bignumber.js';

  export default {
    components: {
      IonBadge,
      IonProgressBar,
      IonSpinner,
      IonMenuToggle,
      IonRange,
      IonContent,
      IonHeader,
      IonPage,
      IonTitle,
      IonToolbar,
      IonImg,
      IonInput,
      IonButton,
      IonIcon,
      IonText,
      IonAlert,
      IonCol,
      IonRow,
      IonGrid,
      IonItem, 
      IonLabel, 
      IonList, 
      IonListHeader,
      IonModal,
      IonButtons
    },
    unmounted () {
        if(this.reloadInterval != null) {
            clearInterval(this.reloadInterval)
        }
    },
    data() {
        return {
            networkErrorMessage:"",
            alertButtons: ["OK"],
            isAlertOpen: false,
            usdPerFFG: 0.05,
            convertToUSD: "0.00",
            tmpTXInfo: {
                chain: "",
                data: "",
                from: "",
                hash: "",
                nounce: "",
                public_key: "",
                signature:"",
                to : "",
                transaction_fees: "",
                value: "",
            },
            lastTXSent : "",
            submitTx: false,
            loadingTransactions: false,
            loadingInterval: false,
            reloadInterval: null,
            balance: "0",
            transactions: [],
        }
    },
    async mounted() {
        this.reloadInterval  = setInterval(this.reloadTransactions , 10000);

        try {
            this.loadingTransactions = true;
            let txRes = await this.getTransactions();
            this.transactions = txRes;
            let balanceRes = await this.getBalance();

            let balanceBig = new BigNumber(balanceRes.balance_hex, 16);
            let balanceInFFG = Units.convert(balanceBig.toString(10), "FFGOne", "FFG")
            this.balance = new BigNumber(balanceInFFG, 10).toString(10)
            let parts = this.balance.split(".");
            this.convertToUSD = this.formatMoney(Number(parts[0]) * this.usdPerFFG)
        } catch (e) {
            this.presentAlert("Error", e.message)
        } finally {
            this.loadingTransactions = false;
        }
    }, 
    methods: {
        setIsAlertOpen(val) {
            this.isAlertOpen = val;
        },
        formatMoney(amount) {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2
            });
            return formatter.format(amount);
        },
        formatTimestampHuman(unixTimestamp) {
            const date = new Date(unixTimestamp * 1000); 
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2); 
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2); 
            const seconds = ('0' + date.getSeconds()).slice(-2);
            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        },
        openTxModal(tx) {
            this.$refs.modalInfo.$el.present();
            this.tmpTXInfo = tx;
        },
        formatAmount(amount) {
            let amountBig = new BigNumber(amount, 16);
            return Units.convert(amountBig.toString(10), "FFGOne", "FFG")
        },  
        async openUrl() {
            await Browser.open({ url: "https://filefilego.com" });
        },
        async getBalance() {
            const data = {
                jsonrpc: '2.0',
                method: "address.Balance",
                params: [{ address: this.receiveAddress}],
                id: 1
            };
            const endpoint = ref(globalState.endpoint);
            const response = await axios.post(endpoint.value, data);
            return response.data.result;
        },
        async sendRawTX(tx) {
            const data = {
                jsonrpc: '2.0',
                method: "transaction.SendRawTransaction",
                params: [{ raw_transaction: tx}],
                id: 1
            };
            const endpoint = ref(globalState.endpoint);
            const response = await axios.post(endpoint.value, data);
            return response.data.result;
        },
        async reloadTransactions() {
            try {
                this.loadingInterval = true;
                let txRes = await this.getTransactions();
                this.transactions = txRes;
                let balanceRes = await this.getBalance();
                let balanceBig = new BigNumber(balanceRes.balance_hex, 16);
                let balanceInFFG = Units.convert(balanceBig.toString(10), "FFGOne", "FFG")
                this.balance = new BigNumber(balanceInFFG, 10).toString(10)
                let parts = this.balance.split(".");
                this.convertToUSD = this.formatMoney(Number(parts[0]) * this.usdPerFFG)
            } catch (e) {
                this.networkErrorMessage = "Failed to connect to remote node: "+ e.message;
                this.setIsAlertOpen(true);
            } finally {
                this.loadingInterval = false
            }
        },  
        async getTransactions() {
            const data = {
                jsonrpc: '2.0',
                method: "transaction.ByAddress",
                params: [{ address: this.receiveAddress, current_page:0, page_size: 10 }],
                id: 1
            };
            const endpoint = ref(globalState.endpoint);
            const response = await axios.post(endpoint.value, data);
            return response.data.result.transactions;
        },
        async presentToast(message) {
            const toast = await toastController.create({
            message: message,
            duration: 5000,
            position: "bottom"
            });

            await toast.present();
        },
        async copyAddressToClipboard() {
            await Clipboard.write({
                string: this.receiveAddress
            });

            this.presentToast("Address copied!")
        }, 
        markAddressTouched() {
            this.$refs.inputAddress.$el.classList.add('ion-touched')
        },
        markAmountTouched() {
            this.$refs.inputAmount.$el.classList.add('ion-touched')
        },
        markFeesTouched() {
            this.$refs.inputFees.$el.classList.add('ion-touched')
        },
        validateAddress(ev) {
            const value = ev.target.value;

            this.$refs.inputAddress.$el.classList.remove('ion-valid');
            this.$refs.inputAddress.$el.classList.remove('ion-invalid');

            if (value === '') return;
            
            let validated = true;
            if (value.length != 42) {
                validated = false;
            } 

            if (!value.startsWith("0x")) {
                 validated = false;
            }

            validated ? this.$refs.inputAddress.$el.classList.add('ion-valid') : this.$refs.inputAddress.$el.classList.add('ion-invalid');
        },
        validateAmount(ev) {
            const value = ev.target.value;

            this.$refs.inputAmount.$el.classList.remove('ion-valid');
            this.$refs.inputAmount.$el.classList.remove('ion-invalid');

            if (value === '') return;
            
            let validated = true;
            
            try {
                Units.convert(value, "FFG", "FFGOne")
            } catch (e) {
                validated = false
            }

            validated ? this.$refs.inputAmount.$el.classList.add('ion-valid') : this.$refs.inputAmount.$el.classList.add('ion-invalid');
        },
        validateFees(ev) {
            const value = ev.target.value;

            this.$refs.inputFees.$el.classList.remove('ion-valid');
            this.$refs.inputFees.$el.classList.remove('ion-invalid');

            if (value === '') return;
            
            let validated = true;

             try {
                Units.convert(value, "FFG", "FFGOne")
            } catch (e) {
                validated = false
            }
            

            validated ? this.$refs.inputFees.$el.classList.add('ion-valid') : this.$refs.inputFees.$el.classList.add('ion-invalid');
        },
        async submit() {
            try {
                if(this.submitTx) {
                    return;
                }

                this.submitTx = true;

                let valueFFGOneString = Units.convert(this.toValue, "FFG", "FFGOne")
                let valueFFGOne = new BigNumber(valueFFGOneString, 10).toString(16)
                if (valueFFGOne == "0") {
                    throw new Error(
                    `Amount must be greater than zero`
                    );
                }

                let feesFFGOneString = Units.convert(this.toFees, "FFG", "FFGOne")
                let feesFFGOne = new BigNumber(feesFFGOneString, 10).toString(16)
                if (feesFFGOne == "0") {
                    throw new Error(
                    `Fees must be greater than zero`
                    );
                }

                if (this.toAddress === '') {
                    throw new Error(
                        `Address is empty`
                    );
                }

                if (this.toAddress.length != 42) {
                     throw new Error(
                        `Address is invalid`
                    );
                } 

                if (!this.toAddress.startsWith("0x")) {
                    throw new Error(
                        `Address should start with 0x`
                    );
                }

                const privKey = ref(globalState.privateKey);
                let balanceRes = await this.getBalance();


                let balanceFFGOneBig = numberToBN(balanceRes.balance_hex);
                let valueBig = numberToBN("0x"+valueFFGOne);
                let feesBig = numberToBN("0x"+feesFFGOne);

                let totalFees = valueBig.add(feesBig);

                if(balanceFFGOneBig.lt(totalFees)) {
                    this.presentAlert("Error", "You don't have enough coins in your balance!")
                    return
                }
              
                let finalTx = SignTransaction(privKey.value, balanceRes.next_nounce, "0x", this.toAddress, "0x"+valueFFGOne, "0x"+feesFFGOne)
                this.presentAlert("Sent", "Your transaction was successfully sent, please wait for the confirmation.")
                let txHashResp = await this.sendRawTX(finalTx)
                this.lastTXSent = txHashResp.transaction.hash;
                this.cancel()
            } catch (e) {
                this.presentAlert("Error", e.message)
            } finally {
                this.submitTx = false;
            }
        },
        cancel() {
            this.$refs.modal.$el.dismiss(null, 'cancel');
        },
        cancelReceive() {
            this.$refs.modalReceive.$el.dismiss(null, 'cancel');
        },
        cancelTXInfo() {
            this.$refs.modalInfo.$el.dismiss(null, 'cancel');
        },        
        confirm() {
            const name = this.$refs.input.$el.value;
            this.$refs.modal.$el.dismiss(name, 'confirm');
        },
        onWillDismiss(ev) {
            if (ev.detail.role === 'confirm') {}
        },
        formatTimestamp(timestamp) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(timestamp * 1000);
            const month = months[date.getMonth()];
            const day = date.getDate();
            return { month: month, day: day };
        },
        async presentAlert(subHeader, message){
            const alert = await alertController.create({
                backdropDismiss: false,
                header: '',
                subHeader: subHeader,
                message: message,
                buttons: ["OK"]
            });

            await alert.present();
        },
    },
    async setup() {
        const address = ref(globalState.address);
        return {
            receiveAddress: address,
            toAddress: "",
            toValue: "",
            toFees : "0.001",
            arrowDownCircleOutline,
            paperPlaneOutline,
            ellipsisVerticalOutline,
            keyOutline,
            copyOutline,
            menuOutline,
            cashOutline,
        }
    }
  }
  </script>
  
  <style scoped>

  </style>
  