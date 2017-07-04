export default {
  template: {
    signIn: "<@#1> おはようございます (#2)",
    signInUpdate: "<@#1> 出勤時間を#2へ変更しました",
    signOut: "<@#1> お疲れ様でした (#2)",
    signOutUpdate: "<@#1> #2は休憩なしに変更しました",
    noRest: "<@#1> #2は休憩なしに変更しました",
    signInFirst: "#1はまだ出勤押してません。このコマンドを出勤してから実行してください",
    signOutFirst: "#1はまだ退勤押してません。このコマンドを退勤してから実行してください",
    alreadySignedIn: "#1はもう出勤してますよ",
    alreadySignedOut: "#1はもう退勤してますよ",
    restHours: "<@#1> #2は#3時間の休憩(中抜け)を登録しました",
    dayTotal: "<@#1> さんの#2の勤務は#3～#4就業時間#5時間、休憩#6時間、時間外労働#7時間、深夜労働#8時間です",
    monthTotal: '#1さんの#2の集計:\n就業 - #3時間時\n間外労働 - #4時間\n深夜労働 - #5時間',
    didnotWorkThatMonth: "#1さんが#2に出勤しませんでした",
    didnotSignOutOn: "#1さんが#2に退勤しませんでした",
    help: 'timesheetsの使い方：\n\nおはようございます 〜 今の時間で出勤登録\n\nおはようございます 10:00 〜 10時に出勤登録\n\n5/4は11:30に出勤しました 〜 5月4日の出勤時間を11:30で登録\n\nお疲れ様でした 〜 今の時間で退勤登録\n\n5/4は18:30に退勤しました 〜 5月4日の退勤時間を18:30で登録\n\n◯は△時間なかぬけでした 〜 ◯の休憩△時間追加\n\n今日は休憩なしでした 〜 今日の休憩を0時間に更新。注意：このコマンド打たないと休憩1時間を登録させます\n\n今日は休憩1.5時間 〜 今日の休憩を1.5時間に更新。\n\n◯は何時間働きましたか 〜 ◯に働いた時間と休憩時間を表示\n\n集計 :username year/month 〜 usernameのユーザーのyear年month月に働いた就業時間を表\n(例: 集計 :n.rashidov 2017/4)'
  },
  dateTimeSettings: {
    am: "午前",
    pm: "午後",
    oclock: "時",
    hours: "時間",
    yesterday: "昨日",
    today: "今日",
    tomorrow: "明日",
    year: "年",
    month: "月",
    day: "日"
  },
  commands: {
    dayTotal: "何時間働|勤務時間",
    help: "使い方",
    monthTotal: "集計",
    noRest: "休憩なし",
    restHours: "なかぬけ|中抜|休憩(?!なし)",
    signIn: "(モ[ー〜]+ニン|も[ー〜]+にん|おっは|おは|へろ|はろ|ヘロ|ハロ|出勤)",
    signOut: "(バ[ー〜ァ]*イ|ば[ー〜ぁ]*い|おやすみ|お[つっ]ー|おつ|さらば|お先|お疲|帰|乙|退勤|ごきげんよ|グ[ッ]?バイ)"
  },
  timesheets: {
    date: "日付",
    signIn: "出勤",
    signOut: "出勤",
    note: "出勤",
    restTime: "休憩",
    workedHours: "就業時間",
    overtimeHours: "時間外労働",
    latenightHours: "深夜労働"
  }
}