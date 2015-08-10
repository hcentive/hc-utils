(function() {
    var MIN_AGE=18,
        MAX_AGE=120,
        MAX_WEIGHT=600,
        MAX_BUDGET=99999,
        ALPHA_NUMERIC=/^[a-z0-9]*$/i,
        ALPHA=/^[a-z]*$/i,
        PASSWORD=/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, // 1 uppercase,1 lowrcase, 1 numeric , minlength=8,
        SSN=/^(?!98765432[0-9])(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4}$/,
        SSN_HYPHENATED=/^(?!987-65-432[0-9])(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/,
        validateMap = {};
    
    var getQueryStringValue = function(key) {
            return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        },
        removeItemFromArray = function(arr, item) {
            if (arr && arr.length) {
                var itemIndex = arr.indexOf(item);
                if (itemIndex != -1)
                    arr.splice(itemIndex, 1);
            }
        },
        formatDate = function(dateObj, dateFormat) {
            var momentWrapper = moment(dateObj);
            return momentWrapper.format(dateFormat);
        },
        isLessThan = function(a,b){
            if(angular.isNumber(a) && angular.isNumber(b)){
                return a<b;    
            }else {
                if(a !== null && b !== null){
                    a=parseFloat(a);
                    b=parseFloat(b);
                    return a<b;
                }
                else
                {
                    return true;
                }
            }
            
        },
        isLessThanEqual = function(a,b){
            if(angular.isNumber(a) && angular.isNumber(b)){
                return a<=b;    
            }else {
                if(a !== null && b !== null){
                    a=parseFloat(a);
                    b=parseFloat(b);
                    return a<=b;
                }
                else
                {
                    return true;
                }
            }
        },
        isGreaterThanEqual = function(a,b){
            if(angular.isNumber(a) && angular.isNumber(b)){
                return a>=b;    
            }else {
                if(a !== null && b !== null){
                    a=parseFloat(a);
                    b=parseFloat(b);
                    return a>=b;
                }
                else
                {
                    return true;
                }
            }
        },
        isGreaterThan = function(a,b){
            if(angular.isNumber(a) && angular.isNumber(b)){
                return a>b;    
            }else {
                if(a !== null && b !== null){
                    a=parseFloat(a);
                    b=parseFloat(b);
                    return a>b;
                }
                else
                {
                    return true;
                }
            }
        },
        isEqual = function(a,b){
            return a===b;
        },
        isNotEqual = function(a,b){
            return a!==b;
        },
        isValidSize = function(input,size){
            //assuming input to be a string
            return input.length===size;
        },
        isValidUserName = function(uname){
            return uname.length>=6;
        },
        isValidAge = function(age){
            return this.MIN_AGE<=age && this.MAX_AGE>=age;
        },
        isValidWeight = function(w){
            return w>=0 && w<=this.MAX_WEIGHT;
        },
        getMomentDate = function(date,dateFormat){
            if(moment.isMoment(date)){
                return date;
            }else if(date instanceof Date){
                return moment(date);
            }else{
                return moment(date,dateFormat,true);
            }
        },
        _isValidDate = function(date,dateFormat)
        { 
            if(date){
                var d = this.getMomentDate(date,dateFormat);
                return d.isValid();
            }else{
                return true;
            }
        },
        isValidDob = function(date,range,dateFormat){
        	if(angular.isObject(range))
        	{
        		this.MIN_AGE = angular.isDefined(range.minAge) ? range.minAge : 18;
        		this.MAX_AGE = angular.isDefined(range.maxAge) ? range.maxAge : 120;
        	}
            var d = this.getMomentDate(date,dateFormat),
            age = moment().diff(d, 'years');
            return this.isValidAge(age);
        },
        isDateAfter = function(d,date,dateFormat){
            //d : date to be check 
            //date : specfic date
            if(typeof d === "undefined") return;

            var _d=this.getMomentDate(d,dateFormat);
            var _date=this.getMomentDate(date,dateFormat);

            //if dates are invalid do not validate
            if(!_d.isValid() || !_date.isValid()){
                return true;
            }

            return _d.isAfter(_date,'day');
        },
        isDateAfterEqual = function(d,date,dateFormat){
            if(typeof d === "undefined") return;
            
            var _d=this.getMomentDate(d,dateFormat);
            var _date=this.getMomentDate(date,dateFormat);
            return _d.isAfter(_date,'day') || _d.isSame(_date,'day');
        },
        isDateBefore = function(d,date,dateFormat){
            if(typeof d === "undefined") return;
            
            var _d=this.getMomentDate(d,dateFormat);
            var _date=this.getMomentDate(date,dateFormat);
            return _d.isBefore(_date,'day');
        },
        isDateBeforeEqual = function(d,date,dateFormat){
            if(typeof d === "undefined") return;
            
            var _d=this.getMomentDate(d,dateFormat);
            var _date=this.getMomentDate(date,dateFormat);
            return _d.isBefore(_date,'day') || _d.isSame(_date,'day');
        },
        isValidBudget = function(b){
            return b>=0 && b<=this.MAX_BUDGET;
        },
        isAlphaNumeric = function(str){
            return this.ALPHA_NUMERIC.test(str);
        },
        isAlpha = function(str){
            return this.ALPHA.test(str);
        },
        isValidPassword = function(str){
            return this.PASSWORD.test(str);
        },
        isValidNonMilitaryHour = function(a){
            return a>=0 && a<=12;
        },
        isValidMilitaryHour = function(a){
            return a>=0 && a<=24;
        },
        isUniqueStringInGroup = function(group,id,value) {
            this.validateMap[group] = this.validateMap[group] || {};
            for (var i in this.validateMap[group]) {
                if (this.validateMap[group][i] == value && i != id) {
                    return false;
                }
            }
            this.validateMap[group][id] = value;
            return true;
        },
        isValidSSN = function(ssn){
            if(_.isString(ssn)){
                if(ssn.indexOf('-') !== -1){
                    return this.SSN_HYPHENATED.test(ssn);
                }
                return this.SSN.test(ssn);
            }
            return true;
        },
        //inspired from http://stackoverflow.com/questions/5900840/post-nested-object-to-spring-mvc-controller-using-json
        serializeJSON = (function() {
            // copy from jquery.js
            var r20 = /%20/g,
                rbracket = /\[\]$/,
                serializeJSON = function(a) {
                    var s = [],
                        add = function(key, value) {
                            // If value is a function, invoke it and return its value
                            value = _.isFunction(value) ? value() : value;
                            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                        };

                    for (var prefix in a) {
                        buildParams(prefix, a[prefix], add);
                    }

                    // Return the resulting serialization
                    return s.join("&").replace(r20, "+");
                }
                /* private method*/
            function buildParams(prefix, obj, add) {
                if (_.isArray(obj)) {
                    // Serialize array item.
                    _.each(obj, function(v, i) {
                        if (rbracket.test(prefix)) {
                            // Treat each array item as a scalar.
                            add(prefix, v);

                        } else {
                            buildParams(prefix + "[" + (typeof v === "object" || _.isArray(v) ? i : "") + "]", v, add);
                        }
                    });

                } else if (obj != null && typeof obj === "object") {
                    // Serialize object item.
                    for (var name in obj) {
                        buildParams(prefix + "." + name, obj[name], add);
                    }

                } else {
                    // Serialize scalar item.
                    add(prefix, obj);
                }
            };
            return serializeJSON;
        })();
        /**
 * Tries to decode the URI component without throwing an exception.
 *
 * @private
 * @param str value potential URI component to check.
 * @returns {boolean} True if `value` can be decoded
 * with the decodeURIComponent function.
 */
    function tryDecodeURIComponent(value) {
      try {
        return decodeURIComponent(value);
      } catch (e) {
        // Ignore any invalid uri component
      }
    }

    /**
     * Parses an escaped url query string into key-value pairs.
     * @returns {Object.<string,boolean|Array>}
     */
    function parseKeyValue(/**string*/keyValue) {
      var obj = {}, key_value, key;
      _.each((keyValue || "").split('&'), function(keyValue) {
        if (keyValue) {
          key_value = keyValue.replace(/\+/g,'%20').split('=');
          key = tryDecodeURIComponent(key_value[0]);
          if (!_.isUndefined(key)) {
            var val = !_.isUndefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
            if (!hasOwnProperty.call(obj, key)) {
              obj[key] = val;
            } else if (_.isArray(obj[key])) {
              obj[key].push(val);
            } else {
              obj[key] = [obj[key],val];
            }
          }
        }
      });
      return obj;
    }
    window["HCUtils"] = {
        SSN: SSN,
        SSN_HYPHENATED: SSN_HYPHENATED,
        MIN_AGE: MIN_AGE,
        MAX_AGE: MAX_AGE,
        MAX_WEIGHT: MAX_WEIGHT,
        MAX_BUDGET: MAX_BUDGET,
        ALPHA_NUMERIC: ALPHA_NUMERIC,
        ALPHA: ALPHA,
        PASSWORD: PASSWORD, // 1 uppercase,1 lowrcase, 1 numeric , minlength=8 
        validateMap: validateMap,
        getQueryStringValue: getQueryStringValue,
        removeItemFromArray: removeItemFromArray,
        formatDate: formatDate,
        isLessThan: isLessThan,
        isLessThanEqual: isLessThanEqual,
        isGreaterThanEqual: isGreaterThanEqual,
        isGreaterThan: isGreaterThan,
        isEqual: isEqual,
        isNotEqual: isNotEqual,
        isValidSize: isValidSize,
        isValidUserName: isValidUserName,
        isValidAge: isValidAge,
        isValidWeight: isValidWeight,
        getMomentDate: getMomentDate,
        _isValidDate: _isValidDate,
        isValidDob: isValidDob,
        isDateAfter: isDateAfter,
        isDateAfterEqual: isDateAfterEqual,
        isDateBefore: isDateBefore,
        isDateBeforeEqual: isDateBeforeEqual,
        isValidBudget: isValidBudget,
        isAlphaNumeric: isAlphaNumeric,
        isAlpha: isAlpha,
        isValidPassword: isValidPassword,
        isValidNonMilitaryHour: isValidNonMilitaryHour,
        isValidMilitaryHour: isValidMilitaryHour,
        isUniqueStringInGroup: isUniqueStringInGroup,
        isValidSSN: isValidSSN,
        serializeJSON: serializeJSON,
        parseKeyValue: parseKeyValue
    };
})();
