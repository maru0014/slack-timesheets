// 入力内容を解析して、メソッドを呼び出す
// Timesheets = loadTimesheets();

loadTimesheets = function (exports) {
  var Timesheets = function(storage, settings, responder) {
    this.storage = storage;
    this.responder = responder;
    this.settings = settings;

    var self = this;
    this.responder.on('receiveMessage', function(username, message) {
      self.receiveMessage(username, message);
    });
  };

  // メッセージを受信する
  Timesheets.prototype.receiveMessage = function(username, message) {
    // 日付は先に処理しておく
    this.date = DateUtils.parseDate(message);
    this.time = DateUtils.parseTime(message);
    this.datetime = DateUtils.normalizeDateTime(this.date, this.time);
    if(this.datetime !== null) {
      this.dateStr = DateUtils.format("Y/m/d", this.datetime);
      this.datetimeStr = DateUtils.format("Y/m/d H:M", this.datetime);
    }

    // コマンド集
    var commands = [
      ['actionSignOut', /(バ[ー〜ァ]*イ|ば[ー〜ぁ]*い|おやすみ|お[つっ]ー|おつ|さらば|お先|お疲|帰|乙|退勤|ごきげんよ|グ[ッ]?バイ)/],
      ['actionWhoIsOff', /(だれ|誰).*(休|やす(ま|み|む))/],
      ['actionWhoIsIn', /(だれ|誰)/],
      ['actionCancelOff', /(やす(ま|み|む)|休暇).*(キャンセル|消|止|やめ|ません)/],
      ['actionOff', /(やす(ま|み|む)|休暇)/],
      ['actionSignIn', /(モ[ー〜]+ニン|も[ー〜]+にん|おっは|おは|へろ|はろ|ヘロ|ハロ|出勤)/],
      ['actionNoKyuukei', /(休憩なし)/],
      ['actionNakanuke', /(なかぬけ|休憩)/],
      ['actionMonthTotal', /(集計)/],
      ['confirmSignIn', /__confirmSignIn__/],
      ['confirmSignOut', /__confirmSignOut__/],
      ['actionDayTotal', /(何時間働)/],
      ['actionHelp', /(help)/]
    ];

    // メッセージを元にメソッドを探す
    var command = _.find(commands, function(ary) {
      return(ary && message.match(ary[1]));
    });

    // メッセージを実行
    if(command && this[command[0]]) {
      return this[command[0]](username, message);
    }
  };

  // calculatemonthtotal -- TODO 一ヶ月の計算
  Timesheets.prototype.actionMonthTotal = function(username, message) {
    var userReg = /:([^\s]+)/;
    var user = userReg.exec(message);
    user = user[1];

    var yearReg = /\d+(?=\/)/;
    var year = yearReg.exec(message);
    year = year[0];

    var monthReg = /\d+$/;
    var month = monthReg.exec(message);
    month = month[0]-1;

    var calculateMonth = this.storage.getMonthTotal(user, month, year);
    this.responder.send(calculateMonth);
  };


  // help
  Timesheets.prototype.actionHelp = function(username, message) {
    this.responder.send(
        "timesheetsの使い方：" +
        "\n\n" +
        "おはようございます 〜 今の時間で出勤登録" +
        "\n\n" +
        "おはようございます 10:00 〜 10時に出勤登録" +
        "\n\n" +
        "5/4は11:30に出勤しました 〜 5月4日の出勤時間を11:30で登録" +
        "\n\n" +
        "お疲れ様でした 〜 今の時間で退勤登録" +
        "\n\n" +
        "5/4は18:30に退勤しました 〜 5月4日の退勤時間を11:30で登録" +
        "\n\n" +
        "◯は△時間なかぬけでした 〜 ◯の休憩△時間追加" +
        "\n\n" +
        "今日は休憩なしでした 〜 今日の休憩を0時間に更新。注意：このコマンド打たないと休憩1時間を登録させます" +
        "\n\n" +
        "今日は休憩1時間 〜 今日の休憩を1時間に更新。" +
        "\n\n" +
        "◯はやすみです 〜 ◯日付の列に'ー'付ける" +
        "\n\n" +
        "◯はやすみキャンセル 〜 ◯日付の列から'ー'を削除" +
        "\n\n" +
        "誰が出勤してますか 〜 出勤中のユーザーを表示" +
        "\n\n" +
        "誰がやすみ 〜 休みのユーザーを表示" +
        "\n\n" +
        "◯は何時間働きましたか 〜 ◯に働いた時間と休憩時間を表示" +
        "\n\n" +
        "集計 :username year/month 〜 usernameのユーザーのyear年month月に働いた就業時間を表" +
        "\n" +
        "(例: 集計 :n.rashidov 2017/4)"
    );
  };

  // 合計時間
  Timesheets.prototype.actionDayTotal = function(username, message) {
    if(this.date) {
      var dateObj = new Date(this.date[0], this.date[1]-1, this.date[2]);
      var data = this.storage.get(username, dateObj);
      if (data.signIn && data.signOut && data.workedHours) {
        this.responder.template("合計時間", username, DateUtils.format("Y/m/d", dateObj), data.kyuukei, data.workedHours, DateUtils.format("H:M", data.signIn), DateUtils.format("H:M", data.signOut));
      } else {
        this.responder.send("まだ退勤してませんよ");
      }
    }
  };

  // なかぬけ
  Timesheets.prototype.actionNakanuke = function(username, message) {
    if(this.date) {
      var dateObj = new Date(this.date[0], this.date[1]-1, this.date[2]);
      var data = this.storage.get(username, dateObj);
      var nakanukeTime = message.replace(/^\D+|\D+$/g, "");
      // if signin on the date is not blank or - then proceed with registering nakanuke
      if (data.signIn && data.signIn != '-') {
        // if hasnt done お疲れ yet, dont touch workedHours, else change workedHours
        if(!data.signOut) {
          this.storage.set(username, dateObj, {kyuukei: nakanukeTime});
        }
        else {
          var workedHours = data.signOut - data.signIn;
          workedHours = workedHours/ 1000 / 60 / 60;
          this.storage.set(username, dateObj, {kyuukei: nakanukeTime, workedHours: rounder(workedHours)-nakanukeTime});
        }
        this.responder.template("なかぬけ", username, this.dateStr, nakanukeTime);
        this.actionDayTotal(username, message);
      }
    }
  };

  // 休憩なし
  Timesheets.prototype.actionNoKyuukei = function(username, message) {
    if(this.date) {
      var dateObj = new Date(this.date[0], this.date[1]-1, this.date[2]);
      var data = this.storage.get(username, dateObj);
      // if signin on the date is not blank or - then proceed with registering nakanuke
      if (data.signIn && data.signIn != '-') {
        // if hasnt done お疲れ yet, dont touch workedHours, else change workedHours
        if (!data.signOut) {
          this.storage.set(username, dateObj, {kyuukei: '0'});
        }
        else {
          var workedHours = data.signOut - data.signIn;
          workedHours = workedHours / 1000 / 60 / 60;
          this.storage.set(username, dateObj, {kyuukei: '0', workedHours: rounder(workedHours)});
        }
        this.responder.template("休憩なし", username, DateUtils.format("Y/m/d", dateObj));
        this.actionDayTotal(username, message);
      }
    }
  };

  // 出勤
  Timesheets.prototype.actionSignIn = function(username, message) {
    if(this.datetime) {
      var data = this.storage.get(username, this.datetime);
      if(!data.signIn || data.signIn === '-') {
        this.storage.set(username, this.datetime, {signIn: this.datetime, kyuukei: '1'});
        this.responder.template("出勤", username, this.datetimeStr);
      }
      else {
        // 更新の場合は時間を明示する必要がある
        if(!!this.time) {
          this.storage.set(username, this.datetime, {signIn: this.datetime});
          this.responder.template("出勤更新", username, this.datetimeStr);
        }
      }
    }
  };

  // 退勤
  Timesheets.prototype.actionSignOut = function(username, message) {
    if(this.datetime) {
      var data = this.storage.get(username, this.datetime);
      var workedHours;
      if(!data.signOut || data.signOut === '-') {
        workedHours = Math.abs(this.datetime - data.signIn);
        workedHours = workedHours/ 1000 / 60 / 60;
        this.storage.set(username, this.datetime, { signOut: this.datetime, workedHours: rounder(workedHours) - data.kyuukei });
        this.responder.template("退勤", username, this.datetimeStr);
        this.actionDayTotal(username, message);
      }
      else {
        // 更新の場合は時間を明示する必要がある
        if(!!this.time) {
          workedHours = Math.abs(this.datetime - data.signIn);
          workedHours = workedHours/ 1000 / 60 / 60;
          this.storage.set(username, this.datetime, {signOut: this.datetime, workedHours: rounder(workedHours) - data.kyuukei});
          this.responder.template("退勤更新", username, this.datetimeStr);
          this.actionDayTotal(username, message);
        }
      }
    }
  };

  // 休暇申請
  Timesheets.prototype.actionOff = function(username, message) {
    if(this.date) {
      var dateObj = new Date(this.date[0], this.date[1]-1, this.date[2]);
      var data = this.storage.get(username, dateObj);
      // if(!data.signOut || data.signOut === '-') {　// day-off does not work if the row isnt empty, so i commented the if() out
        this.storage.set(username, dateObj, {signIn: '-', signOut: '-', note: message, kyuukei: '-', workedHours: '-'});
        this.responder.template("休暇", username, DateUtils.format("Y/m/d", dateObj));
      // }
    }
  };

  // 休暇取消
  Timesheets.prototype.actionCancelOff = function(username, message) {
    if(this.date) {
      var dateObj = new Date(this.date[0], this.date[1]-1, this.date[2]);
      var data = this.storage.get(username, dateObj);
      if(!data.signOut || data.signOut === '-') {
        this.storage.set(username, dateObj, {signIn: null, signOut: null, note: message, kyuukei: null, workedHours: null});
        this.responder.template("休暇取消", username, DateUtils.format("Y/m/d", dateObj));
      }
    }
  };

  // 出勤中
  Timesheets.prototype.actionWhoIsIn = function(username, message) {
    var dateObj = DateUtils.toDate(DateUtils.now());
    var result = _.compact(_.map(this.storage.getByDate(dateObj), function(row) {
      return _.isDate(row.signIn) && !_.isDate(row.signOut) ? row.user : undefined;
    }));

    if(_.isEmpty(result)) {
      this.responder.template("出勤なし");
    }
    else {
      this.responder.template("出勤中", result.sort().join(', '));
    }
  };

  // 休暇中
  Timesheets.prototype.actionWhoIsOff = function(username, message) {
    var dateObj = DateUtils.toDate(DateUtils.now());
    var dateStr = DateUtils.format("Y/m/d", dateObj);
    var result = _.compact(_.map(this.storage.getByDate(dateObj), function(row){
      return row.signIn === '-' ? row.user : undefined;
    }));

    // 定休の処理
    var wday = dateObj.getDay();
    var self = this;
    _.each(this.storage.getUsers(), function(username) {
      if(_.contains(self.storage.getDayOff(username), wday)) {
        result.push(username);
      }
    });
    result = _.uniq(result);

    if(_.isEmpty(result)) {
      this.responder.template("休暇なし", dateStr);
    }
    else {
      this.responder.template("休暇中", dateStr, result.sort().join(', '));
    }
  };

  // // 出勤していない人にメッセージを送る
  // Timesheets.prototype.confirmSignIn = function(username, message) {
  //   var self = this;
  //   var holidays = _.compact(_.map((this.settings.get("休日") || "").split(','), function(s) {
  //     var date = DateUtils.parseDateTime(s);
  //     return date ? DateUtils.format("Y/m/d", date) : undefined;
  //   }));
  //   var today = DateUtils.toDate(DateUtils.now());
  //
  //   // 休日ならチェックしない
  //   if(_.contains(holidays, DateUtils.format("Y/m/d",today))) return;
  //
  //   var wday = DateUtils.now().getDay();
  //   var signedInUsers = _.compact(_.map(this.storage.getByDate(today), function(row) {
  //     var signedIn = _.isDate(row.signIn);
  //     var off = (row.signIn === '-') || _.contains(self.storage.getDayOff(row.user), wday);
  //     return (signedIn || off) ? row.user : undefined;
  //   }));
  //   var users = _.difference(this.storage.getUsers(), signedInUsers);
  //
  //   if(!_.isEmpty(users)) {
  //     this.responder.template("出勤確認", users.sort());
  //   }
  //
  //   // バージョンチェックを行う
  //   if(typeof checkUpdate == 'function') checkUpdate(this.responder);
  // };

  // // 退勤していない人にメッセージを送る
  // Timesheets.prototype.confirmSignOut = function(username, message) {
  //   var dateObj = DateUtils.toDate(DateUtils.now());
  //   var users = _.compact(_.map(this.storage.getByDate(dateObj), function(row) {
  //     return _.isDate(row.signIn) && !_.isDate(row.signOut) ? row.user : undefined;
  //   }));
  //
  //   if(!_.isEmpty(users)) {
  //     this.responder.template("退勤確認", users.sort());
  //   }
  // };

  return Timesheets;
};

if(typeof exports !== 'undefined') {
  exports.Timesheets = loadTimesheets();
}
function rounder(num) {
  var intPart = Math.floor(num);

  var decimalPart = num - intPart;
  if (decimalPart >= 0.75) {
    return intPart+".75";
  }
  else if (decimalPart >= 0.5) {
    return intPart+".5";
  }
  else if (decimalPart >= 0.25) {
    return intPart+".25";
  }
  else {
    return intPart;
  }
}