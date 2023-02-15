
/**
 * モーダルOpen
 */
const openModal = payload => {
    const modalView = generateModalView()
    const viewData = {
      token: SLACK_ACCESS_TOKEN,
      trigger_id: payload.trigger_id,
      view: JSON.stringify(modalView)
    }
    const postUrl = 'https://slack.com/api/views.open'
    const viewDataPayload = JSON.stringify(viewData)
    const options = {
      method: "post",
      contentType: "application/json",
      headers: { "Authorization": `Bearer ${SLACK_ACCESS_TOKEN}` },
      payload: viewDataPayload
    }
  
    UrlFetchApp.fetch(postUrl, options)
    return ContentService.createTextOutput()
    // ステップ2: TradingViewのログインページにアクセスし、ユーザーにログイン誘導する
    const loginUrl = 'https://www.tradingview.com/login'
    const loginWindow = window.open(loginUrl, '_blank')
    
    // ステップ3: TradingViewからアクセストークンを取得する
    let accessToken = ''
    const handleTokenReceived = e => {
      if (e.origin !== 'https://www.tradingview.com') return
      accessToken = e.data
      window.removeEventListener('message', handleTokenReceived)
      
      // ステップ4: 取得したアクセストークンをIdea Detailブロックに自動入力する
      document.getElementById('idea-detail-block').value = accessToken
      
      // Slack API呼び出し
      UrlFetchApp.fetch(postUrl, options)
      return ContentService.createTextOutput()
    }
    window.addEventListener('message', handleTokenReceived)
  }
  
  /**
   * モーダルBlocks
   */
  const generateModalView = () => {
    return {
      "type": "modal",
      "title": {
        "type": "plain_text",
        "text": "whitelisting tool in stg",
        "emoji": true
      },
      "submit": {
        "type": "plain_text",
        "text": "登録する",
        "emoji": true
      },
      "close": {
        "type": "plain_text",
        "text": "キャンセル",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*DeviceIDをホワイトリストに登録します*"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "input",
          "block_id": "device_id",
          "element": {
            "type": "plain_text_input",
            "multiline": false,
            "action_id": "device_id"
          },
          "label": {
            "type": "plain_text",
            "text": "device_id",
            "emoji": false
          }
        },
        {
          "type": "section",
          "block_id": "actions",
          "text": {
            "type": "mrkdwn",
            "text": "Pick an action from the dropdown list"
          },
          "accessory": {
            "action_id": "actions",
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select an item"
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Insert or Update"
                },
                "value": "value-0"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "Remove"
                },
                "value": "value-1"
              }
            ]
          }
        }
      ]
    }
  }