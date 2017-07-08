export default {
  template: {
    signIn: "Hello, <@#1>! Signed you in (#2)",
    signInUpdate: "<@#1> Sign-in time changed to #2",
    signOut: "<@#1> Good bye! (#2)",
    signOutUpdate: "<@#1> Sign-out time changed to #2",
    noRest: "<@#1> Changed rested hours to 0 on #2",
    signInFirst: "<@#1> You have not signed in on #2 yet. Run this command after signing in",
    signOutFirst: "<@#1> You have not signed out on #2 yet. Run this command after signing out",
    alreadySignedIn: "<@#1> You have already singed in on #2",
    alreadySignedOut: "<@#1> You have already singed out on #2",
    restHours: "<@#1> Changed the rest hours to #3 on #2",
    dayTotal: '<@#1> Your total for #2 is:\nWorked time: #3～#4\nWorked hours: #5\nRest hours: #6\nOvertime hours: #7\nLate hours: #8\n#9',
    monthTotal: '#1\'s total for #2:\nWorked hours: #3\nOvertime Hours: #4\nLate hours: #5',
    didnotWorkThatMonth: "#1 has 0 worked hours in #2",
    didnotSignOutOn: "#1 forgot to sign out on #2",
    help: 'Timesheets commands ( | separates different commands that do the same thing):\n(All commands are case-insensitive)\n\nChange locale to ja ~ Change locale to the specified one.\n\nHello | Hi | Sign in ~ Register current time and date in Sign In field, and automatically add 1 hour to Rest time\n\nHi 10:00 | Hello 10am | Signed in at 2pm yesterday | I signed in at 12pm on 2017/06/01 | etc. ~ Register the time and date (if no date is specified, date = today) in the Sign in field, and RestTime is not changed\n\nGood bye | Bye | Sign out ~ Register current time and date in Sign Out field and calculate and show total for the date\n\nBye 18:30 | I signed out at 6:30pm on 2017/6/1 ~ Register the time and date (if no date is specified, date = today) in the Sign out field, and show total for that date\n\nI took a 2 hour break today | I took a break of 3.5 hours on 2017/6/1 ~ Register the specified break time in Rest Time field and show total hours for the date\n\nI did not take a break today ~ Register 0 as a RestTime for the specified date.\n\nHow many hours did I work today? | Show day total for 2017/6/1 ~ Show total hours for the specified date\n\nCancel my shift for 2017/6/1 ~ Replace SignIn and SignOut with -, and register every other field as 0. Show day total for the date\n\nShow month total :username 2017/6 ~ Show username\'s total worked hours for the specified month (the \':\' is mandatory, and date must be in YYYY/MM format)',
    cancelShift: '<@#1> Your shift on #2 has been cancelled',
    changeLocale: '<@#1> Locale changed to #2',
    changeLocaleFailed: '<@#1> #2 locale does not exist. Could not change locale'
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
    monthTotal: "show\\s*month\\s*total", // Show month total for :username 2017/06 (YYYY/MM/)
    noRest: "did\\s*not\\s*take(\\s*a)?\\s*break", // I did not take a break yesterday
    restHours: "^((?!not).)*took.*break", // I took a 3 hour break today
    signIn: "\\bhi\\b|\\bhello\\b|sign(ed)?\\s*in", // Hi | Sign in | I signed in at 10am today
    signOut: "(good)?\\s*bye|sign(ed)?\\s*out",  // Bye | Sign out | I signed out at 7pm today
    cancelShift: "cancel.*shift" // Cancel my today's shift | Cancel my shift on 2017/06/27 (YYYY/MM/DD)
  },
  timesheets: {
    date: "Date",
    signIn: "Sign In",
    signOut: "Sign out",
    note: "Note",
    restTime: "Rested time",
    workedHours: "Worked Hours",
    overtimeHours: "Overtime hours",
    latenightHours: "Late night hours",
    cancelShift: "Shift was cancelled"
  }
}