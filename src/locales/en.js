export default {
  template: {
    signIn: "Hello, <@#1>! Signed you in (#2)",
    signInUpdate: "<@#1> Sign-in time changed to #2",
    signOut: "<@#1> Good bye! (#2)",
    signOutUpdate: "<@#1> Sign-out time changed to #2",
    noRest: "<@#1> Changed rested hours to 0 on #2",
    signInFirst: "You have not signed in on #1 yet. Run this command after signing in",
    signOutFirst: "You have not signed out on #1 yet. Run this command after signing out",
    alreadySignedIn: "You have already singed in on #1",
    alreadySignedOut: "You have already singed out on #1",
    restHours: "<@#1> Changed the rest hours to #3 on #2",
    dayTotal: '<@#1> Your total for #2 is:\nWorked time - #3～#4\nWorked hours: #5\nRest hours: #6\nOvertime hours: #7\nLate hours: #8',
    monthTotal: '#1\'s total for #2:\nWorked hours: #3\nOvertime Hours: #4\nLate hours: #5',
    didnotWorkThatMonth: "#1 has 0 worked hours in #2",
    didnotSignOutOn: "#1 forgot to sign out on #2",
    help: 'timesheetsの使い方：\n\nおはようございます 〜 今の時間で出勤登録\n\nおはようございます 10:00 〜 10時に出勤登録\n\n5/4は11:30に出勤しました 〜 5月4日の出勤時間を11:30で登録\n\nお疲れ様でした 〜 今の時間で退勤登録\n\n5/4は18:30に退勤しました 〜 5月4日の退勤時間を18:30で登録\n\n◯は△時間なかぬけでした 〜 ◯の休憩△時間追加\n\n今日は休憩なしでした 〜 今日の休憩を0時間に更新。注意：このコマンド打たないと休憩1時間を登録させます\n\n今日は休憩1.5時間 〜 今日の休憩を1.5時間に更新。\n\n◯は何時間働きましたか 〜 ◯に働いた時間と休憩時間を表示\n\n集計 :username year/month 〜 usernameのユーザーのyear年month月に働いた就業時間を表\n(例: 集計 :n.rashidov 2017/4)'
  },
  dateTimeSettings: {
    am: "am",
    pm: "pm",
    oclock: "oclock",
    hours: "hour(s)?",
    yesterday: "yesterday",
    today: "today",
    tomorrow: "tomorrow",
    year: "year",
    month: "month",
    day: "day"
  },
  commands: {
    dayTotal: "how\\s*many\\s*hours+|show\\s*day\\s*total", // how many hours did I work today? | Show day total for yesterday
    help: "help",
    monthTotal: "show\\s*month\\s*total", // Show month total for :username 2017/6
    noRest: "did\\s*not\\s*take(\\s*a)?\\s*break", // I did not take a break yesterday
    restHours: "^((?!not).)*took.*break", // I took a 3 hour break today
    signIn: "hi|hello|sign(ed)?\\s*in", // Hi | Sign in | I signed in at 10am today
    signOut: "(good)?\\s*bye|sign(ed)?\\s*out"  // Bye | Sign out | I signed out at 7pm today
  },
  timesheets: {
    date: "Date",
    signIn: "Sign In",
    signOut: "Sign out",
    note: "Note",
    restTime: "Rested time",
    workedHours: "Worked Hours",
    overtimeHours: "Overtime hours",
    latenightHours: "Late night hours"
  }
}