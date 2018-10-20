{
    "use strict";
    let uiController, dataController, appController;

    dataController = (() => {
        let date, curMonth, monthsArr, currentMonthName, shiftArr, Month;

        date = new Date();
        curMonth = date.getMonth();
        monthsArr = [{name: 'January', length: 31}, {name: 'February', length: 28}, {name: 'March', length: 31}, {name: 'April', length: 30}, {name: 'May'}, {name: 'June', length: 30}, {name: 'July', length: 31}, {name: 'August', length: 31}, {name: 'September', length: 30}, {name: 'October', length: 31}, {name: 'November', length: 30}, {name:'December', length: 31}];
        shiftArr = ['8:00am - 2:00pm', '2:00pm - 8:00pm'];
        currentMonthName = monthsArr[curMonth].name;

        Month = function(name) {
            this.name = name;
            this.length = function() {
                // false || true for leap year
                return (this.leapStatus() === false) ? monthsArr[curMonth].length : ++monthsArr[curMonth].length; 
            };
        };

        Month.prototype.leapStatus = () => {
            let status, splitStr;
            status = new Date(date.getFullYear(), 1, 29);
            // @ts-ignore
            splitStr = status.toString().split(' ');
            // returns false || true for leap year
            return (splitStr[1] !== 'Feb') ? false : true;
        };

        return {
            createShift: () => {
                let month, shiftSchedule, leaveStart;

                month = new Month(currentMonthName);
                shiftSchedule = [];                

                for (let i = 0; i < month.length(); i++) {
                    shiftSchedule.push(shiftArr[Math.floor(Math.random() * 2)]);
                }

                leaveStart = Math.floor((Math.random() * (shiftSchedule.length) - 4) + 1);
                
                shiftSchedule[leaveStart] = "leave Day";  
                shiftSchedule[++leaveStart] = "leave Day";  
                shiftSchedule[++leaveStart] = "leave Day";  
                return shiftSchedule; 
            }
        };
    })();
    uiController = (() => {
        let DOMStrings;

        DOMStrings = {
            generateButton: '.genButton',
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
        let generateShift, initEventListener, DOM;

        DOM = uiCtrl.getDOMStrings();

        initEventListener = () => {
            document.querySelector(DOM.generateButton).addEventListener('click', generateShift);
        };

        generateShift = () => {
            let shiftSchedule;
            shiftSchedule = dtCtrl.createShift();
            console.log(shiftSchedule);
        };

        return {
            init: () => {
                initEventListener();
                console.log('App was initialised Succesfully!');
            }
        };

    })(uiController, dataController);

    appController.init();
}