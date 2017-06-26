export default {
  template: {
    "signIn": "<@#1> おはようございます (#2)",
    "signInUpdate": "<@#1> 出勤時間を#2へ変更しました",
    "signOut": "<@#1> お疲れ様でした (#2)",
    "signOutUpdate": "<@#1> #2は休憩なしに変更しました",
    "noRest": "<@#1> #2は休憩なしに変更しました",
    "signInFirst": "#1はまだ出勤押してません。このコマンドを出勤してから実行してください",
    "signOutFirst": "#1はまだ退勤押してません。このコマンドを退勤してから実行してください",
    "alreadySignedIn": "#1はもう出勤してますよ",
    "alreadySignedOut": "#1はもう退勤してますよ",
    "restHours": "<@#1> #2は#3時間の休憩(中抜け)を登録しました",
    "dayTotal": "<@#1> さんの#2の勤務は#3～#4就業時間#5時間、休憩#6時間、時間外労働#7時間、深夜労働#8時間です",
    "monthTotal": '#1さんの#2月集計:\n就業 - #3時間時\n間外労働 - #4時間\n深夜労働 - #5時間',
    "didnotWorkThatMonth": "#1さんが#2に出勤しませんでした",
    "didnotSignOutOn": "#1さんが#2に退勤しませんでした",
    "help": "helpcommandTODO"
  },
  common: {
    "key": "hello worldz"
  }
}