{
    "use strict";
    let uiController, dataController, appController;

    dataController = (() => {
        let date, currMonth, currYear, monthsArr, currMonthName, shiftArr, Month, Person, leaveSchedule;

        date = new Date();
        currYear = date.getFullYear();
        currMonth = date.getMonth();
        monthsArr = [{ name: 'January', length: 31 }, { name: 'February', length: 28 }, { name: 'March', length: 31 }, { name: 'April', length: 30 }, { name: 'May', length: 31 }, { name: 'June', length: 30 }, { name: 'July', length: 31 }, { name: 'August', length: 31 }, { name: 'September', length: 30 }, { name: 'October', length: 31 }, { name: 'November', length: 30 }, { name: 'December', length: 31 }];
        shiftArr = ['8:00am - 2:00pm', '2:00pm - 8:00pm'];
        currMonthName = monthsArr[currMonth].name;

        Month = function (month) {
            this.name = () => {
                return monthsArr[month].name;
            };
            this.length = () => {
                // false || true for leap year
                return (this.leapStatus() === false) ? monthsArr[month].length : ++monthsArr[month].length;
            };
        };

        Month.prototype.leapStatus = () => {
            let status, splitStr;
            status = new Date(date.getFullYear(), 1, 29);
            
            splitStr = status.toString().split(' ');
            // returns false || true for leap year
            return (splitStr[1] !== 'Feb') ? false : true;
        };

        Person = function (name, level) {
            this.name = name;
            this.level = level;
            this.long = true;
        };

        Person.prototype.leaveLength = function () {
            let shiftLength, a, rest, first, second, val;

            shiftLength = [21, 30, 42];

            (this.level <= 5) ? val = 5 : (this.level >= 7 ? val = 7 : val = 6);

            switch (val) {
                case 5:
                    [a, ...rest] = shiftLength;
                    break;

                case 6:
                    [first, a, ...rest] = shiftLength;
                    break;

                case 7:
                    [first, second, a] = shiftLength;
                    break;

                default:
                    return 'level doesnt exist';
            }
            return a;
        };

        leaveSchedule = (obj, month) => {
            let leaveMonth, leaveMonthYear, data;
            
            leaveMonth = new Month(month);
            data = {
                leaveLength: obj.leaveLength(),
                leaveMonth: leaveMonth.name(),
                leaveMonthLength: leaveMonth.length(),
                startYear: currYear
            };

            // leave start date, added 1 so it never starts from 0;
            // @ts-ignore
            data.startDate = Math.floor(Math.random() * data.leaveMonthLength) + 1;

            // (mapped) days left in leave month
            // @ts-ignore
            data.restDays = (data.leaveMonthLength - data.startDate);

            // (unmapped) days left in leave days, negative if end date is in current month; positive if th .update: subtracted 1
            // @ts-ignore
            data.leaveDaysLeft = (data.leaveLength - data.restDays) - 1;

            // if leave month is 11: december, next month is 0, else next month is leave month + 1
            (month === 11) ? leaveMonthYear = {
                nextMonth: 0, 
                year: currYear + 1
            } : leaveMonthYear = {
                nextMonth: month + 1,
                year: currYear
            };

            // @ts-ignore
            data.endYear = leaveMonthYear.year;

            // following month Object
            // @ts-ignore
            data.nextMonth = (new Month(leaveMonthYear.nextMonth)).name();

            // @ts-ignore
            data.nextMonthLength = (new Month(leaveMonthYear.nextMonth)).length();
  
            // @ts-ignore
            data.startMonth = data.leaveMonth;
  
            // @ts-ignore
            if (data.leaveDaysLeft > 0) {
                // for rest days less than leave length
                let nextRemDays;

                // @ts-ignore
                nextRemDays = data.nextMonthLength - data.leaveDaysLeft;

                if (nextRemDays <= 0) {
                    // leave days left is greater than length of month after leave month
                    let thirdMonth, _thirdMonth;
                    
                    month === 10 ? _thirdMonth = 0 : _thirdMonth = leaveMonthYear.nextMonth + 1;

                    // fix .name of undefined error from months === 10 monthsArr[nonsense]

                    thirdMonth = (new Month(_thirdMonth));
                    // @ts-ignore
                    data.thirdMonth = thirdMonth.name();
                    // @ts-ignore
                    data.thirdMonthLength = thirdMonth.length();

                    // @ts-ignore
                    data.endMonth = thirdMonth.name();

                    // data.endDate = (nextRemDays + thirdMonth.length());
                    // @ts-ignore
                    data.endDate = -(nextRemDays);

                    // @ts-ignore
                    data.fullDate = `leave starts on ${data.startMonth} ${data.startDate}, ${data.startYear} and ends on ${data.endMonth} ${data.endDate}, ${data.endYear}`;

                } else if (nextRemDays > 0) {
                    // leave days left is less than length of month after leave month

                    // @ts-ignore
                    data.endMonth = monthsArr[leaveMonthYear.nextMonth].name;
                    
                    // @ts-ignore
                    data.endDate = data.leaveDaysLeft;
                }

                // @ts-ignore
                data.fullDate = `leave starts on ${data.startMonth} ${data.startDate}, ${data.startYear} and ends on ${data.endMonth} ${data.endDate}, ${data.endYear}`;
            // @ts-ignore
            } else if (data.leaveDaysLeft <= 0) {
                // for rest days greater than leave length
                // @ts-ignore
                data.endDate = (data.startDate + data.leaveLength) - 1;

                // @ts-ignore
                data.startDate > 10 ? data.endDate =- data.nextMonthLength : data.endDate;

                // @ts-ignore
                (data.startDate > 10) && (month === 11) ? data.endMonth = monthsArr[leaveMonthYear.nextMonth].name : data.endMonth = data.leaveMonth;

                // @ts-ignore
                data.fullDate = `leave starts on ${data.startMonth} ${data.startDate}, ${data.startYear} and ends on ${data.endMonth} ${data.endDate}, ${data.endYear}`;
            }
            return data;
        };

        // save stuff to DB method

        return {
            setLeaveMonth: () => {
                const month = Math.floor(Math.random() * 12);
                return month;
                // call method that saves stuff to DB
            },
            getData: (monthNumber = currMonth) => {
                let person, month;
                month = new Month(monthNumber);
                return {
                    personObj: function (name, level) {
                        return person = new Person(name, level);
                    },
                    monthObj: function () {
                        return month;
                    }
                };
            },
            createShift: (month) => {
                // @ts-ignore
                let shiftPool, shiftSchedule,lastEl;

                shiftSchedule = [];
                shiftPool = ['M', 'N', 'O', 'O', 'L'];
                shiftSchedule.push(shiftPool[Math.floor(Math.random() * 4)]);

                while (shiftSchedule.length < month.length()) {
                    lastEl = shiftPool.lastIndexOf(shiftSchedule[shiftSchedule.length - 1]);

                    if (shiftPool[lastEl + 1] !== undefined) {
                        shiftSchedule.push(shiftPool[lastEl + 1]);
                    } else {
                        shiftSchedule.push('M');
                    }                   
                } 
                return shiftSchedule;
            },
            getLeaveSchedule: (obj, month) => {
                return leaveSchedule(obj, month);
            } 
        };
    })();

    uiController = (() => {
        let DOMStrings;

        DOMStrings = {
            shiftButton: '.shiftButton',
            leaveButton: '.leaveButton',
            yearType: '.yearType',
            castButton: '.castButton'
        };

        return {
            getDOMStrings: () => {
                return DOMStrings;
            }
        };
    })();

    appController = ((uiCtrl, dtCtrl) => {
        // @ts-ignore
        let generateShift, initEventListener, DOM, setAnnualLeave, objects;

        DOM = uiCtrl.getDOMStrings();
        objects = dtCtrl.getData();

        initEventListener = () => {
            document.querySelector(DOM.shiftButton).addEventListener('click', generateShift);
            document.querySelector(DOM.leaveButton).addEventListener('click', setAnnualLeave);
        };

        setAnnualLeave = () => {
            let _leaveMonth;
            /* 
            * call method that sets leave month, save to database
            * gets leave and or leave schedule from DB
            */
            _leaveMonth = dtCtrl.setLeaveMonth();
            
            const person = objects.personObj('israel', 5);
            console.log(dtCtrl.getLeaveSchedule(person, dtCtrl.setLeaveMonth()));
            
            const person_1 = objects.personObj('israel', 6);
            console.log(dtCtrl.getLeaveSchedule(person_1, dtCtrl.setLeaveMonth()));

            const person_2 = objects.personObj('israel', 7);
            console.log(dtCtrl.getLeaveSchedule(person_2, _leaveMonth));
        };

        generateShift = () => {
            let shiftSchedule;
            
            console.log(objects.monthObj().name());
            shiftSchedule = dtCtrl.createShift(objects.monthObj());
            console.log(shiftSchedule);
        };

        /* 
            database is indexedDB
            add to database
            query from database
            
            // get Leave Month from DB if different return shiftSchedule else, fill with normal shift from leave end date
        */

        return {
            init: () => {
                initEventListener();
                console.log('App was initialised Succesfully!');
            }
        };

    })(uiController, dataController);
    appController.init();
}