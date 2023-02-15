const doPost = (e) => {
  const parameter = e.parameter

  try {
    // 自分が作成したSlackアプリからのリクエストでない場合はエラー
    if (SLACK_TOKEN != parameter.token) throw new Error(parameter.token)

    // モーダルを開くようにSlackへリクエスト
    return openModal(parameter)
  } catch(error) {
    return ContentService.createTextOutput(`403: ${error}`)
  }
}