import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Display from './Display';
import Math from 'mathjs';

var trigDisplay = "";
var boolClear = true;
var stackVal1 = 1;
var stackVal2 = 0;
var strMathError = "Math Error";
var strEmpty = 0;
var maxLength = 8;
var openArray = [];
var displayString = "";
var opCode = 0;
var newOpCode = 0;
var opCodeArray = [];
var stackVal = 0;
var stackArray = [];
var trig = 0;
var strNaN = "NaN";
var strInf = "Infinity";
var oscError = "ERROR";
var memVal = 0;
var modeSelected = "deg"
var memory = 0;
var display = "";
var afterdec = "";
var dS = "";
var index;

var chVal = 0;
class App extends Component {
  constructor(props) {
    super(props)
    // this.myRef = React.createRef();
    this.btnRef = React.createRef();
    this.state = {
      inBox: [strEmpty],
      inBox1: [],
      mem:"hide",
      selectedOption: "deg",
      
      
    }

  }



  buttonNumeric = e => {
    var value = e.target.getAttribute('value');
    var inBoxVal = this.state.inBox.join('');
    var inBox1Val = this.state.inBox1.join('');
   
    
    // var character = inBox1Val.substring(inBox1Val.length-1);
//     if(chVal === 1 && inBoxVal.length > 0){
// console.log("hey");
//       this.setState({
//       inBox : [""],
//       });
//     }
    if (inBoxVal.indexOf("Infinity") > -1 || inBoxVal.indexOf(strMathError) > -1) return;
    if (boolClear) {
      inBoxVal = 0;
      boolClear = false;
    }

    var str = inBoxVal;
    // console.log("str"+str);
    if (str.length > maxLength) return;
    if (value === "." && str.indexOf('.') >= 0 && inBox1Val.length !== 0) {
      this.setState({
        inBox: [strEmpty + "."],
        inBox1: [],
      });
      return;
    }
    else if (value === "." && str.indexOf('.') >= 0)
      return;
    this.displayCheck();
  
    if (parseInt(str) !== strEmpty || str.length > 1 || value === ".") {
      // console.log("str value", str);
      // console.log("strEmpty value", strEmpty)
      // console.log("Updating")
      // console.log("Len inside if", str.length)
      this.setState({
        inBox: [str+value],
        // inBox1:[value],
      });
      stackVal1 = 1;
    }
    else {
      // console.log("str value1", str);
      this.setState({

        inBox: [value],
      });
      stackVal1 = 1;
    }


  }

  buttonConst = e => {
    var retVal = strEmpty;
    var value = e.target.getAttribute('value');
    var inBoxVal = this.state.inBox.join('');
    var inputBox = this.state.inBox.join('');
    var inBox1Val = this.state.inBox1;
    if (inBoxVal.indexOf("Infinity") > -1 || inBoxVal.indexOf(strMathError) > -1) return;
    switch (value) {
      case "π": retVal = Math.PI;
        break;
      case "keyPad_btnE": retVal = Math.E;
        break;
      default: break;
    }

    this.displayCheck();
    stackVal1 = 1;
    boolClear = true;
    if (retVal !== strEmpty) {
      this.setState({
        inBox: [retVal],
      });
    } else {
      this.setState({
        inBox: [retVal],
      });
    }

  }

  btnBinary = e => {
    var value = e.target.getAttribute('value');
    var inBoxVal = this.state.inBox.join('');
    var inBox1Val = this.state.inBox1.join('');
    if (inBoxVal.indexOf("Infinity") > -1 || inBoxVal.indexOf(strMathError) > -1) return;
    switch (value) {
      case '+': this.stackCheck(value);
        newOpCode = 1;
        if (opCode === 10 && stackArray.length > 0 && stackArray[stackArray.length - 1] === '{')
          this.opcodeChange();
        this.operation();
        stackVal1 = 0;
       
        break;
      case '-': this.stackCheck(value);
        newOpCode = 2;
        if (opCode === 10 && stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")
          this.opcodeChange();
        this.operation();
        stackVal1 = 0;
        break;
      case '*': this.stackCheck(value);
        newOpCode = 3;
        if (opCode === 1 || opCode === 2) {
          this.opcodeChange();
        }
        if (opCode === 10) {
          if (opCodeArray[opCodeArray.length - 1] < 3 || (stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")) {
            this.opcodeChange();
          }
          else {
            this.operation();
          }
        }
        stackVal1 = 0;
        break;
      case '/': this.stackCheck(value);
        newOpCode = 4;
        if (opCode < 4 && opCode) {
          this.opcodeChange();
        }
        if (opCode === 10) {
          if (opCodeArray[opCodeArray.length - 1] < 4 || stackVal1 === 5 || (stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")) {
            this.opcodeChange();
          }
          else {
            this.operation();
          }
        }
        stackVal1 = 0;
        break;
      case '%': this.stackCheck("%");
        newOpCode = 11;
        if (opCode < 6 && opCode) {
          this.opcodeChange();
        }
        if (opCode === 10) {
          if (opCodeArray[opCodeArray.length - 1] < 6 || (stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")) {
            this.opcodeChange();
          }
          else {
            this.operation();
          }
        }
        stackVal1 = 0;
        break;

      case 'EXP': this.stackCheck("e+0");
        newOpCode = 9;
        if (opCode < 6 && opCode) {
          this.opcodeChange();
        }
        if (opCode === 10) {
          if (opCodeArray[opCodeArray.length - 1] < 6 || (stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")) {
            this.opcodeChange();
          }
          else {
            this.operation();
          }
        }
        stackVal1 = 1;
        stackVal2 = 7;
        break;
      case 'YpowX': this.stackCheck("^");
        newOpCode = 6; if (opCode < 6 && opCode) {
          this.opcodeChange();
        }
        if (opCode === 10) {
          if (opCodeArray[opCodeArray.length - 1] < 6 || (stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")) {
            this.opcodeChange();
          }
          else {
            this.operation();
          }
        }
        stackVal1 = 0;
        break;
      case 'mod': this.stackCheck(value);
        newOpCode = 5;
        if (opCode === 1 || opCode === 2) {
          this.opcodeChange();
        }
        if (opCode === 10) {
          if (opCodeArray[opCodeArray.length - 1] === 1 || 2 || (stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")) {
            this.opcodeChange();
          }
          else {
            this.operation();
          }
        }
        stackVal1 = 0;
        break;
      case 'YrootX':
        this.stackCheck("yroot");
        newOpCode = 7;
        if (opCode < 6 && opCode) {
          this.opcodeChange();
        }
        if (opCode === 10) {
          if (opCodeArray[opCodeArray.length - 1] < 6 || (stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")) {
            this.opcodeChange();
          }
          else {
            this.operation();
          }
        }
        stackVal1 = 0;
        break;
      case 'YlogX': this.stackCheck("logxBasey");
        newOpCode = 8;
        if (opCode === 1 || opCode === 2) {
          this.opcodeChange();
        }
        if (opCode === 10) {
          if (opCodeArray[opCodeArray.length - 1] < 3 || (stackArray.length > 0 && stackArray[stackArray.length - 1] === "{")) {
            this.opcodeChange();
          }
          else {
            this.operation();
          }
        }
        stackVal1 = 0;
        break;
      case '(': displayString = inBox1Val + value;
        newOpCode = 0;
        this.setState({
          inBox: [0],
        });
        if (opCode !== 0) {
          this.opcodeChange();
        }
        openArray.push("{");
        stackArray.push("{");
        stackVal1 = 1;
        break;
      case ')': if (stackVal2 === 6) {
        stackVal = parseFloat(inBoxVal);
        displayString = inBox1Val + inBoxVal + value;
      }
      else if (newOpCode !== 10) {
        if (stackVal1 !== 3) {
          if ((inBox1Val.indexOf("e+0") > -1) && inBoxVal.indexOf("-") > -1)
            this.setState({
              inBox1: [inBox1Val.replace("e+0", "e")],
            });
          else if ((inBox1Val.indexOf("e+0") > -1))
            this.setState({
              inBox1: [inBox1Val.replace("e+0", "e+")],
            });
          displayString = inBox1Val + inBoxVal + value;
        }
        else
          displayString = inBox1Val + value;
      }
      else {
        displayString = inBox1Val + value;
      }
        if (openArray[0]) {
          openArray.pop();
          newOpCode = 10;
          while (opCodeArray[0] || openArray[0]) {
            if (stackArray[stackArray.length - 1] === "{") {
              stackArray.pop();
              break;
            }
            else {
              this.oscBinaryOperation();
              stackVal = stackArray[stackArray.length - 1];
              if (stackVal === "{") {
                stackArray.pop();
                opCode = 0;
                break;
              }
              stackArray.pop();
              opCode = opCodeArray[opCodeArray.length - 1];
              opCodeArray.pop();
              if (!opCodeArray[0] && stackArray.length > 0 && stackArray[stackArray.length - 1] !== "{")  //if length is 0 then below statement gives error...
              {
                stackVal = stackArray[stackArray.length - 1];
              }
            }
          }
        }
        else {
          return;
        }
        stackVal2 = 1;
        stackVal1 = 5;
        break;
      case 'percent':
        if (opCode === 1 || opCode === 2) {
          var upDinbox = stackVal * parseFloat(inBoxVal) / 100;
          this.setState({
            inBox: [upDinbox],
          });
        }
        else if (opCode === 3 || opCode === 4) {
          var upD_inbox = parseFloat(inBoxVal) / 100;
          this.setState({
            inBox: [upD_inbox],
          });
        }
        else return;
        break;
      default: break;
    }
    if (opCode) {
      this.oscBinaryOperation();
    }
    else {
      stackVal = parseFloat(inBoxVal);
      boolClear = true;
    }
    opCode = newOpCode;
    this.setState({
      inBox1: [displayString],
    });
 
    // this.setState({
    //   inBox:[],
    // });
  }

  //memory function not done
btnMemory = e => {
  var value = e.target.getAttribute('value');
  var inBoxVal = this.state.inBox.join('');
  var x = parseFloat(inBoxVal);
  if(inBoxVal===""){
    x = 0;
  }
  var retVal = 0;
  if (inBoxVal.indexOf("Infinity") > -1 || inBoxVal.indexOf(strMathError) > -1) return;
  switch(value){
    case 'MS' : memory = x;
                this.setState({
                  mem : "show",
                })
                retVal = inBoxVal;
                break; 
    case 'M+' : memory=x+parseFloat(memory);  
                this.setState({
                  mem : "show",
                })
                retVal = inBoxVal;
                break;
    case 'MR' : retVal = parseFloat(memory);
                stackVal1 = 1;
                break;
    case 'MC': memory = 0;
                this.setState({
                  mem : "hide",
                })
                retVal = inBoxVal;
                break;
    case 'M-' : this.setState({
                mem : "show",
                 }) 
                memory = parseFloat(memory) - x;
                retVal = inBoxVal;
                break;
    default : break;

  }
  if(retVal !== strEmpty){
    this.setState({
      inBox : [retVal],
    })
  }else{
    this.setState({
      inBox : [retVal],
    })
  }
  boolClear = true;


}


  stackCheck = (text) => {
    console.log("Stackval1",stackVal1);
    console.log("hey");
    var inBox1Val = this.state.inBox1.join('');
    var inBoxVal = this.state.inBox.join('');
    if (stackVal1 === 2) {
      this.setState({
        inBox1: [],
      });
    }
    if (stackVal1 === 0) {
      opCode = 0;
      var x = 1;
      switch (newOpCode) {
        case 5: x = 3;
          break;
        case 7: x = 5;
          break;
        case 8: x = 9;
          break;
        default: break;

      }
      var upDinbox1 = inBox1Val.substring(0, inBox1Val.length - x);
      if (!(inBox1Val.indexOf("e+") > -1))
      console.log("Inside update");
        this.setState({
          inBox1: [upDinbox1],
        });
      stackVal2 = 2;
    }
    if (stackVal1 === 5 || stackVal2 === 2) {
      stackVal2 = 0;
      displayString = inBox1Val + text;
      console.log("hey");
    }
    else {
      if (inBox1Val.indexOf("e+0") > -1 && inBoxVal.indexOf("-") > -1)
        this.setState({
          inBox1: [inBox1Val.replace("e+0", "e")],
        });
      else if ((inBox1Val.indexOf("e+0") > -1))
        this.setState({
          inBox1: [inBox1Val.replace("e+0", "e+")],
        });
      displayString = inBox1Val + inBoxVal + text;
      console.log("hey1");
    }
  }


  operation = () => {
    while (opCodeArray[0] && opCode) {
      if (opCode === 10) {
        opCode = opCodeArray[opCodeArray.length - 1];
        stackVal = stackArray[stackArray.length - 1];
        if (newOpCode === 1 || newOpCode === 2 || newOpCode <= opCode) {
          opCodeArray.pop();
          stackArray.pop();
        }
        else {
          opCode = 0;
          break;
        }
      }
      else if (stackArray[stackArray.length - 1] === "{") {
        break;
      }
      else {
        this.oscBinaryOperation();
        stackVal = stackArray[stackArray.length - 1];
        if (stackVal === "{") {
          opCode = 0;
          break;
        }
        opCode = opCodeArray[opCodeArray.length - 1];
        if (newOpCode === 1 || newOpCode === 2 || newOpCode <= opCode) {
          opCodeArray.pop();
          stackArray.pop();
        }
        else {
          opCode = 0;
          break;
        }
        if (!opCodeArray[0] && stackArray.length > 0 && stackArray[stackArray.length - 1] !== "{")  //if length is 0 then below statement gives error...
        {
          stackVal = stackArray[stackArray.length - 1];
        }
      }
    }
  }

  opcodeChange = () => {
    if (opCode !== 10 && opCode !== 0) {
      opCodeArray.push(opCode);
      stackArray.push(stackVal);
    }
    if (opCode === 0) {
      stackArray.push(stackVal);
    }
    opCode = 0;
  }



  displayCheck = () => {
    var inBox1Val = this.state.inBox1.join('');
    console.log("inside funct", inBox1Val)
    console.log("stackVal1",stackVal1);
    switch (stackVal1) {
      case 2: this.setState({
        inBox1: [],
      });
        break;
      case 3: var upDinbox1 = inBox1Val.substring(0, inBox1Val.length - trigDisplay.length);
        this.setState({
          inBox1: [upDinbox1],
        });
        stackVal2 = 4;
        break;
      case 5: var string = "";
        for (var i = openArray.length; i >= 0; i--) {
          string = string + displayString.substring(0, displayString.indexOf("(") + 1);
          displayString = displayString.replace(string, "");
        }
        displayString = string.substring(0, string.lastIndexOf("("));
        this.setState({
          inBox1: [displayString]
        });
        stackVal2 = 6;
        break;

      default:console.log("inside default"); break;
    }
  }

  oscBinaryOperation = () => {
    var inBoxVal = this.state.inBox.join('');
    var x2 = parseFloat(inBoxVal);
    var retVal = 0;
    switch (opCode) {
      case 9: stackVal = parseFloat(stackVal) * Math.pow(10, x2);
        break;
      case 1: stackVal += x2;
        break;
      case 2: stackVal -= x2;
        break;
      case 3: stackVal *= x2;
        break;
      case 4: stackVal /= x2;
        break;
      case 6: var precisioncheck = stackVal;
        stackVal = Math.pow(stackVal, x2);
        if (precisioncheck === 10 && stackVal % 10 !== 0 && (Math.abs(stackVal) < 0.00000001 || Math.abs(stackVal) > 100000000) && x2 % 1 === 0)
          stackVal = stackVal.toPrecision(7);
        break;
      case 5: stackVal = stackVal % x2;
        break;

      case 8: stackVal = Math.log(stackVal) / Math.log(x2);
        break;
      case 11: stackVal = stackVal / 100 * x2;
        break;
      case 0: stackVal = x2;
        break;
      default: break;
    }
    retVal = stackVal;
    if (Math.abs(retVal) < 0.00000001 || Math.abs(retVal) > 100000000) {

    }
    else {
      if (retVal.toFixed(8) % 1 !== 0) {
        var i = 1;
        while (i < 10) {
          if ((retVal.toFixed(i) !== 0) && (retVal.toFixed(i) / retVal.toFixed(i + 8) === 1)) {
            retVal = retVal.toFixed(i);
            break;
          }
          else {
            i++;
          }
        }
      }
      else {
        retVal = retVal.toFixed(0);
      }
      this.setState({
        inBox: [retVal],
      });
      boolClear = true;
      trig = 0;
      // inBox.focus();
    }
  }
 

  //unary operations not done
  btnUnaryOp = e => {
    var value = e.target.getAttribute('value');
    var inputBoxVal = this.state.inBox.join('');
    var inBoxVal = this.state.inBox.join('');
    var inBox1Val = this.state.inBox1.join('');
    var x = parseFloat(inBoxVal);
    console.log(x)
    console.log(value)
    var retVal = oscError;
    if (inBoxVal.indexOf("Infinity") > -1 || inBoxVal.indexOf(strMathError) > -1) return;
    switch (value) {
      //+/-
      case "+/-": retVal = -x; trig = 1; stackVal2 = 3; break;
      //1/x
      case "1/x": retVal = 1 / x; this.displayTrignometric("reciproc", x); break;
      //x^2
      case "x^2": retVal = x * x; this.displayTrignometric("sqr", x); break;
      //SQRT(x)
      case "sqrt": retVal = Math.sqrt(x); this.displayTrignometric("sqrt", x); break;
      // X^3                                 
      case "xCube": console.log(x)

        retVal = x * x * x; this.displayTrignometric("cube", x); break;            // POW (X, 1/3)                                 
      case "cbrt": retVal = this.nthroot(x, 3); this.displayTrignometric("cuberoot", x); break;
      // NATURAL LOG                                 
      case "ln": retVal = Math.log(x); this.displayTrignometric(value, x); break;
      // LOG BASE 10                                 
      case "log": retVal = Math.log(x) / Math.LN10; this.displayTrignometric(value, x); break;
      // E^(X)                                 
      case "exp": retVal = Math.exp(x); this.displayTrignometric("powe", x); break;
      // SIN                                 
      case "sin": retVal = this.sinCalc(modeSelected, x); this.modeText(value, x); trig = 1; break;
      // COS                                 
      case "cos": retVal = this.cosCalc(modeSelected, x); this.modeText(value, x); trig = 1; break;
      // TAN                                 
      case "tan": retVal = this.tanCalc(modeSelected, x); this.modeText(value, x); trig = 1; break;
      // CTG                                 


      //Factorial
      case "fact": console.log(x)
        retVal = this.factorial(x);
        this.displayTrignometric("fact", x);
        break;

      //10^x
      case "10^x": retVal = Math.pow(10, x);
        if (retVal % 10 !== 0 && (Math.abs(retVal) < 0.00000001 || Math.abs(retVal) > 100000000) && (x % 1 === 0))
          retVal = retVal.toPrecision(7);
        this.displayTrignometric("powten", x); break;

      //AsinH
      case "sinh-1": retVal = this.inverseSineH(x); this.modeText(value, x); break;

      //AcosH
      case "cosh-1": retVal = Math.log(x + Math.sqrt(x + 1) * Math.sqrt(x - 1)); this.modeText(value, x); break;

      //AtanH
      case "tanh-1": retVal = 0.5 * (Math.log(1 + x) - Math.log(1 - x)); this.modeText(value, x); break;

      //Absolute |x|
      case "abs": retVal = Math.abs(x); this.displayTrignometric("abs", x); break;

      //Log Base 2
      case "logbase2": retVal = Math.log(x) / Math.log(2);
        this.displayTrignometric("logXbase2", x);
        console.log("retuen value", retVal);
        break;
      case 'sin-1': retVal = this.sinInvCalc(modeSelected,x); this.modeText("asin",x);trig=1;
      break;
      
      case 'cos-1': retVal = this.cosInvCalc(modeSelected,x); this.modeText("acos",x); trig=1;
      break;

      case 'tan-1': retVal= this.tanInvCalc(modeSelected,x); this.modeText("atan",x);trig=1;
      break;

      case 'sinh': retVal = (Math.pow(Math.E,x)- Math.pow(Math.E, -x))/2;
      this.modeText(value,x);
      break;

      case 'cosh': retVal = (Math.pow(Math.E, x) + Math.pow(Math.E, -x)) / 2; 
      this.modeText(value,x);
      break;

      case 'tanh':
          retVal = (Math.pow(Math.E, x) - Math.pow(Math.E, -x));
          retVal /= (Math.pow(Math.E, x) + Math.pow(Math.E, -x));
          this.modeText(value,x);
          break;

      default: break;

    }
    if (stackVal2 === 1) {
      stackVal = retVal;
    }
    if (stackVal2 !== 3) { stackVal2 = 2; }
    stackVal1 = 3;
    boolClear = true;
    
    if (retVal === 0 || retVal === strMathError || retVal === strInf) {
      console.log("valuuee", retVal)
      this.setState({
        inBox: [retVal],
      });
    } else if ((Math.abs(retVal) < 0.00000001 || Math.abs(retVal) > 100000000) && trig !== 1) {
    }
    else {
      console.log("retval", retVal);
      if (retVal.toFixed(8) % 1 !== 0) {
        var i = 1;
        while (i < 10) {
          if ((retVal.toFixed(i) !== 0) && (retVal.toFixed(i) / retVal.toFixed(i + 8) === 1)) { retVal = retVal.toFixed(i); break; }
          else {
            i++;
          }
        }
      }
      else { retVal = retVal.toFixed(0); }
    }

    if (retVal === -0)
      retVal = 0;
    //inputBox.val(retVal);
    console.log("valuuee", retVal)
    this.setState({
      inBox: [retVal],
    });
    trig = 0;
    //inBox1.val(displayString);
    this.setState({
      inBox1: [displayString],
    });
    //inputBox.focus();


  }


  componentDidUpdate () {
modeSelected = document.querySelector('input[name=degree_or_radian]:checked').value;
console.log("heheh",modeSelected);
  }

optionChange = e =>{
  var value = e.target.getAttribute('value');
 this.setState({
   selectedOption:value,
 })
}




  displayTrignometric = (text, x) => {
    console.log(stackVal2);
    if (stackVal2 === 1) {
      var string = "";
      for (var i = openArray.length; i >= 0; i--) {
        string = string + displayString.substring(0, displayString.lastIndexOf("(") + 1);
        displayString = displayString.replace(string, "");
      }
      displayString = string.substring(0, string.lastIndexOf("("));
      trigDisplay = text + "(" + x + ")";
    }

    if (stackVal2 === 2 || stackVal1 === 3) {
      if (stackVal2 === 3) { trigDisplay = text + "(" + x + ")"; stackVal2 = 2; }
      else {
        displayString = displayString.replace(trigDisplay, "");
        trigDisplay = text + "(" + trigDisplay + ")";
      }
    }
    else { if (stackVal2 === 4) { displayString = ""; } trigDisplay = text + "(" + x + ")"; }
    displayString = displayString + trigDisplay;
  }

mode

  inverseSineH = (inputVal) => {
    return Math.log(inputVal + Math.sqrt(inputVal * inputVal + 1));
  }

  modeText = (text, x) => {
    var mode = "d";
    if (modeSelected !== "deg") { mode = "r"; }
    this.displayTrignometric(text + mode, x);
  }

  nthroot = (x, n) => {
    try {
      var negate = n % 2 === 1 && x < 0;
      if (negate)
        x = -x;
      var possible = Math.pow(x, 1 / n);
      n = Math.pow(possible, n);
      if (Math.abs(x - n) < 1 && ((x > 0) === (n > 0)))
        return (negate ? -possible : possible);
      else return (negate ? -possible : possible);
    } catch (e) { }
  }

  changeXBasedOnMode = (mode, inputValue) => {
    if (mode === "deg") {
      return (inputValue * (Math.PI / 180));
    }
    else if (mode === "rad") {
      return inputValue;
    }
  }

  tanCalc = (mode, inputValue) => {
    var ipVal = this.changeXBasedOnMode(mode, inputValue);
    if (ipVal % (Math.PI / 2) === "0") {
      if ((ipVal / (Math.PI / 2)) % 2 === "0") {
        return "0";
      } else {
        return strMathError;
      }
    } else {
      return Math.tan(ipVal);
    }
  }

  cosCalc = (mode, inputVal) => {
    var ipVal = this.changeXBasedOnMode(mode, inputVal);
    if (ipVal.toFixed(8) % (Math.PI / 2).toFixed(8) === "0") {
      if ((ipVal.toFixed(8) / (Math.PI / 2)).toFixed(8) % 2 === "0") {
        return Math.cos(ipVal);
      } else {
        return "0";
      }
    } else {
      return Math.cos(ipVal);
    }
  }

  sinCalc = (mode, inputVal) => {
    var ipVal = this.changeXBasedOnMode(mode, inputVal);
    if ((ipVal.toFixed(8) % Math.PI).toFixed(8) === 0) {
      return "0";
    } else {
      return Math.sin(ipVal);
    }

  }

  cotCalc = (mode, inputVal) => {
    var tanVal = this.tanCalc(mode, inputVal);
    if (tanVal === 0) {
      return strMathError;
    } else if (tanVal === strMathError) {
      return '0';
    } else {
      return 1 / tanVal;
    }

  }

  secCalc = (mode, inputVal) => {
    var cosVal = this.cosCalc(mode, inputVal);
    if (cosVal.toFixed(8) === 0) {
      return strMathError;
    } else {
      return 1 / cosVal;
    }
  }

  cosecCalc = (mode, inputVal) => {
    var sinVal = this.sinCalc(mode, inputVal);
    if (sinVal.toFixed(8) === 0) {
      return strMathError;
    } else {
      return 1 / sinVal;
    }
  }


  changeValOfInvBasedOnMode = (mode, ipVal) => {
    if (mode === 'deg') {
      return (180 / Math.PI) * ipVal;
    } else {
      return ipVal;
    }
  }

  sinInvCalc = (mode, inputVal) => {
    var opVal;
    var ipVal = Math.asin(inputVal);
    if (inputVal < -1 || inputVal > 1) {
      opVal = strMathError;
    } else {
      opVal = this.changeValOfInvBasedOnMode(mode, ipVal);
    }
    return opVal;
  }

  cosInvCalc = (mode, inputVal) => {
    var opVal;
    var ipVal = Math.acos(inputVal);
    if (inputVal < -1 || inputVal > 1) {
      opVal = strMathError;
    } else {
      opVal = this.changeValOfInvBasedOnMode(mode, ipVal);
    }
    return opVal;
  }

  tanInvCalc = (mode, inputVal) => {
    var opVal;
    var ipVal = Math.atan(inputVal);
    if (inputVal < -1 || inputVal > 1) {
      opVal = strMathError;
    } else {
      opVal = this.changeValOfInvBasedOnMode(mode, ipVal);
    }
    return opVal;
  }


  //Factorial Function
  factorial = (n) => {
    console.log("Inside fact", n)
    if (n > 170) return strInf;
    if (n === 1 || n === 0) return 1;
    else if (n < 0) return strMathError;
    else if (n % 1 !== 0) return this.gamma(n + 1);
    else
      return n * this.factorial(n - 1);

  }

  gamma = (n) => {
    var g = 7, // g represents the precision desired, p is the values of p[i] to plug into Lanczos' formula
      p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (n < 0.5) {
      return Math.PI / Math.sin(n * Math.PI) / this.gamma(1 - n);
    } else {
      n--;
      var x = p[0];
      for (var i = 1; i < g + 2; i++) {
        x += p[i] / (n + i);
      }
      var t = n + g + 0.5;
      return (Math.sqrt(2 * Math.PI) * Math.pow(t, (n + 0.5)) * Math.exp(-t) * x);
    }
  }







  btnCommand = e => {
    var value = e.target.getAttribute('value');
    var inBoxVal = this.state.inBox.join('');
    var inBox1Val = this.state.inBox1.join('');
    var i = 0;
    var j = 0;
    var strInput = inBoxVal;
    switch (value) {
      case "=": if (inBoxVal.indexOf("Infinity") > -1 || inBoxVal.indexOf(strMathError) > -1) return;
        while (opCode || opCodeArray[0]) {
          if (stackArray[stackArray.length - 1] === "{") {
            stackArray.pop();
          }
          this.oscBinaryOperation();
          stackVal = stackArray[stackArray.length - 1];
          opCode = opCodeArray[opCodeArray.length - 1];
          stackArray.pop();
          opCodeArray.pop();
        }; opCode = 0; /*inBox.focus();*/ displayString = ""; trigDisplay = ""; stackVal = strEmpty; openArray = [];
        if (stackVal1 !== 2) {
          if (stackVal1 === 3 || stackVal2 === 1) {
            if (stackVal2 !== 3) strInput = "";
          }
          if (newOpCode === 9) {
            if (strInput.indexOf("-") > -1)
              // {inBox1Val(inBox1Val.substring(0,inBox1Val.lastIndexOf("+")));	
              //    } 
              this.setState({
                inBox1: [inBox1Val.substring(0, inBox1Val.lastIndexOf("+"))],
              });
            else {
              // inBox1Val(inBox1Val.replace("e+0","e+"));
              this.setState({
                inBox1: [inBox1Val.replace("e+0", "e+")],
              });
            }
          }
          //inBox1Val(inBox1Val+strInput);		
          this.setState({
            inBox1: [inBox1Val + strInput],
          });
        }
        stackVal1 = 2;
        newOpCode = 0;
        stackVal2 = 0; stackArray = []; opCodeArray = [];
        return;


      case "back": if (stackVal1 === 1 || stackVal2 === 3) {
        if (strInput.length > 1) {
          if (inBoxVal.indexOf("Infinity") > -1 || inBoxVal.indexOf(strMathError) > -1) return;

          this.setState({
            inBox: [strInput.substring(0, strInput.length - 1)],
          });
          if (inBoxVal === "-") {
            this.setState({
              inBox: ["0"],
            });
          };
          break;
        }
      }
      else
        break;
        break;

      case "c":
        this.setState({
          inBox: [strEmpty],
        });
        displayString = "";
        trigDisplay = "";
        stackArray = []; opCodeArray = []; openArray = [];
        this.setState({
          inBox1: [""],
        });
        stackVal = strEmpty;
        stackVal1 = 1;
        stackVal2 = 0;
        newOpCode = 0;
        opCode = 0;
        break;
      default: break;
    }
  }





  render() {
    return (
      <div className="mainContentArea">
        <Display id="dis" data={this.state.inBox1} />
        <Display id="dis" data={this.state.inBox} />

        <span id = "memory" className={this.state.mem}>
          <font size="2">M</font>
        </span>
        <div className="degree_radian">
          
          <input type="radio" name="degree_or_radian" value="deg" checked={this.state.selectedOption === "deg"} onChange={this.optionChange} />Deg
          <input type="radio" name="degree_or_radian" value="rad" checked={this.state.selectedOption === "rad"} onChange={this.optionChange}/>Rad
        </div>
        <div className="left_sec">
        
          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="1">1</button>

          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="2">2</button>

          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="3">3</button>

          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="4">4</button>

          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="5">5</button>
          <br />
          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="6">6</button>

          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="7">7</button>

          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="8">8</button>

          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="9">9</button>

          <button href="#nogo" ref={this.myRef} className="keyPad_btnNumeric" onClick={this.buttonNumeric} value="0">0</button>
          <br />
          <button href="#nogo" ref={this.myRef} className="keyPad_btnDot" onClick={this.buttonNumeric} value=".">.</button>

          <button href="#nogo" id="keyPad_btnPi" className="keyPad_btnConst" onClick={this.buttonConst} value="π">π</button>

          <button href="#nogo" id="keyPad_btnE" className="keyPad_btnConst" onClick={this.buttonConst} value="keyPad_btnE">e</button>

          <button href="#nogo" id="keyPad_btnMod" className="keyPad_btnBinaryOp" value="mod" onClick={this.btnBinary}>mod</button>

          <button href="#nogo" id="keyPad_EXP" className="keyPad_btnBinaryOp" value="EXP" onClick={this.btnBinary}>Exp</button>
          <br />
          <button href="#nogo" id="keyPad_btnOpen" className="keyPad_btnBinaryOp" value="(" onClick={this.btnBinary}>(</button>

          <button href="#nogo" id="keyPad_btnClose" className="keyPad_btnBinaryOp " value=")" onClick={this.btnBinary}>)</button>

          <button href="#nogo" id="keyPad_btnDiv" className="keyPad_btnBinaryOp" value="/" onClick={this.btnBinary}>/</button>

          <button href="#nogo" id="keyPad_%" className="keyPad_btnBinaryOp" value="%" onClick={this.btnBinary}>%</button>

          <button href="#nogo" id="keyPad_btnYlogX" className="keyPad_btnBinaryOp" value="YlogX" onClick={this.btnBinary}>
            <span className="baseele">log</span>
            <span className="subscript">y</span>
            <span className="baseele">x</span>
          </button>
          <br />
          <button href="#nogo" id="keyPad_btnMult" className="keyPad_btnBinaryOp" value="*" onClick={this.btnBinary}>
            *
      </button>

          <button href="#nogo" id="keyPad_btnYpowX" className="keyPad_btnBinaryOp" value="YpowX" onClick={this.btnBinary}>
            <span className="baseele">x</span>
            <span className="superscript">y</span>
          </button>

          <button href="#nogo" id="keyPad_btnMinus" className="keyPad_btnBinaryOp" value="-" onClick={this.btnBinary}>
            -
      </button>

          <button href="#nogo" id="keyPad_btnYrootX" className="keyPad_btnBinaryOp" value="YrootX" onClick={this.btnBinary}>
            y
            √x
      </button>

          <button href="#nogo" id="keyPad_btnPlus" className="keyPad_btnBinaryOp" value="+" onClick={this.btnBinary}>+</button>
          <br />
          <button href="#nogo" id="keyPad_btnEnter" className="keyPad_btnCommand " value="=" onClick={this.btnCommand}>=</button>

          <button href="#nogo" id="keyPad_btnAllClr" className="keyPad_btnCommand" value="c" onClick={this.btnCommand}>C</button>
          <button href="#nogo" id="keyPad_btnBack" className="keyPad_btnCommand calc_arrows" value="back" onClick={this.btnCommand}>
            }←</button>

          <button href="#nogo" id="keyPad_btnFact" className="keyPad_btnUnaryOp" value="fact" onClick={this.btnUnaryOp}>n!</button>
          <button href="#nogo" id="keyPad_btnInverseSign" className="keyPad_btnUnaryOp" value="+/-" onClick={this.btnUnaryOp}>+/-</button>
          <br />
          <button href="#nogo" id="keyPad_btnInverse" className="keyPad_btnUnaryOp" value="1/x" onClick={this.btnUnaryOp}><span className="baseele">1/x</span></button>
          <button href="#nogo" id="keyPad_btnSquare" className="keyPad_btnUnaryOp" value="x^2" onClick={this.btnUnaryOp} ><span className="baseele">x</span><span className="superscript">2</span></button>
          <button href="#nogo" id="keyPad_btnSquareRoot" className="keyPad_btnUnaryOp" value="sqrt" onClick={this.btnUnaryOp}>√</button>
          <button href="#nogo" id="keyPad_btnCube" className="keyPad_btnUnaryOp" value="xCube" onClick={this.btnUnaryOp}>
            x3</button>
          <button href="#nogo" id="keyPad_btnCubeRoot" className="keyPad_btnUnaryOp" value="cbrt" onClick={this.btnUnaryOp}><font size="3">∛ </font></button>
          <br />
          <button href="#nogo" id="keyPad_btnLn" className="keyPad_btnUnaryOp" value="ln" onClick={this.btnUnaryOp}>ln</button>
          <button href="#nogo" id="keyPad_btnLg" className="keyPad_btnUnaryOp" value="log" onClick={this.btnUnaryOp}>log</button>
          <button href="#nogo" id="keyPad_EXP" className="keyPad_btnBinaryOp" value="exp" onClick={this.btnUnaryOp}>ex</button>
          <button href="#nogo" id="keyPad_btnSin" className="keyPad_btnUnaryOp min" value="sin" onClick={this.btnUnaryOp}>sin</button>
          <button href="#nogo" id="keyPad_btnCosin" className="keyPad_btnUnaryOp min" value="cos" onClick={this.btnUnaryOp}>cos</button>
          <br />
          <button href="#nogo" id="keyPad_btnTg" className="keyPad_btnUnaryOp min" value="tan" onClick={this.btnUnaryOp}>tan</button>
          <button href="#nogo" id="keyPad_btn10X" className="keyPad_btnUnaryOp" value="10^x" onClick={this.btnUnaryOp}><span className="baseele">10</span><span className="superscript">x</span></button>
          <button href="#nogo" id="keyPad_btnSinH" className="keyPad_btnUnaryOp min" value="sinh" onClick={this.btnUnaryOp}>sinh</button>
          <button href="#nogo" id="keyPad_btnCosinH" className="keyPad_btnUnaryOp min" value="cosh" onClick={this.btnUnaryOp}>cosh</button>
          <button href="#nogo" id="keyPad_btnTgH" className="keyPad_btnUnaryOp min" value="tanh" onClick={this.btnUnaryOp} >tanh</button>
          <br />
          <button href="#nogo" id="keyPad_btnAbs" className="keyPad_btnUnaryOp" value="abs" onClick={this.btnUnaryOp} >|x|</button>
          <button href="#nogo" id="keyPad_btnLogBase2" className="keyPad_btnUnaryOp" value="logbase2" onClick={this.btnUnaryOp} >log2x</button>
            <br/>
            <button href="#nogo" id="keyPad_MC" className="keyPad_btnMemoryOp" value="MC" onClick={this.btnMemory}>MC</button>
            <button href="#nogo" id="keyPad_MR" className="keyPad_btnMemoryOp" value="MR" onClick={this.btnMemory}>MR</button>
            <button href="#nogo" id="keyPad_MS" className="keyPad_btnMemoryOp" value="MS" onClick={this.btnMemory}>MS</button>
            <button href="#nogo" id="keyPad_M+" className="keyPad_btnMemoryOp" value="M+" onClick={this.btnMemory}>M+</button>
            <button href="#nogo" id="keyPad_M-" className="keyPad_btnMemoryOp" value="M-" onClick={this.btnMemory}>M-</button>
<br/>
<button href="#nogo" id="keyPad_btnAsinH" className="keyPad_btnUnaryOp min" value="sinh-1" onClick={this.btnUnaryOp}>sinh-1</button>
<button href="#nogo" id="keyPad_btnAcosH" className="keyPad_btnUnaryOp min" value="cosh-1" onClick={this.btnUnaryOp}>cosh-1</button>
<button href="#nogo" id="keyPad_btnAtanH" className="keyPad_btnUnaryOp min" value="tanh-1" onClick={this.btnUnaryOp}>tanh-1</button>

<button href="#nogo" id="keyPad_btnAsin" className="keyPad_btnUnaryOp min" value="sin-1" onClick={this.btnUnaryOp}>sin-1</button>
<button href="#nogo" id="keyPad_btnAcos" className="keyPad_btnUnaryOp min" value="cos-1" onClick={this.btnUnaryOp}>cos-1</button>
<button href="#nogo" id="keyPad_btnAtan" className="keyPad_btnUnaryOp min" value="tan-1" onClick={this.btnUnaryOp}>tan-1</button>









        </div>
      </div>
    );
  }

}

export default App;