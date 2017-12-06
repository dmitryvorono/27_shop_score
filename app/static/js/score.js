var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// general settings
var middleX = canvas.width / 2;
var middleY = canvas.height / 2;
var radius = canvas.width / 2 - canvas.width / 10;
// beginning and ending of our arc. Sets by rad * pi
var startAngleIndex = 0.7;
var endAngleIndex = 2.3;

// zones settings
var zoneLineWidth = canvas.width / 30;
var counterClockwise = false;

// ticks settings
var tickWidth = canvas.width / 100;
var tickColor = "#746845";
var tickOffsetFromArc = canvas.width / 40;

// Center circle settings
var centerCircleRadius = canvas.width / 20;
var centerCircleColor = "#efe5cf";
var centerCircleBorderWidth = canvas.width / 100;


// Digits settings
var digits = [];
for (var i = 1; i <= 40; i ++) {
   digits.push(i);
}
var digitsColor = "#746845";
var digitsFont = "bold 10px Tahoma";
var digitsOffsetFromArc = canvas.width / 12;

var zonesCount = digits.length - 1;
var step = (endAngleIndex - startAngleIndex) / zonesCount;

// Arrow settings
var arrowColor = "#464646";
var arrowWidth = canvas.width / 50;

var RecallCanvasConstant = function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    middleX = canvas.width / 2;
    middleY = canvas.height / 2;
    radius = canvas.width / 2 - canvas.width / 10;
    startAngleIndex = 0.7;
    endAngleIndex = 2.3;
    zoneLineWidth = canvas.width / 30;
    tickWidth = canvas.width / 100;
    tickOffsetFromArc = canvas.width / 40;
    centerCircleRadius = canvas.width / 20;
    centerCircleBorderWidth = canvas.width / 100;
    digitsOffsetFromArc = canvas.width / 12;
    step = (endAngleIndex - startAngleIndex) / zonesCount;
    arrowWidth = canvas.width / 50;
};

var DrawZones = function() {
        var greenZonesCount = Math.ceil(6);
        var yellowZonesCount = Math.ceil(23);
        var redZonesCount = zonesCount - greenZonesCount - yellowZonesCount;

        var startAngle = (startAngleIndex - 0.02) * Math.PI;
        var endGreenAngle = (startAngleIndex + greenZonesCount * step) * Math.PI;
        var endYellowAngle = (startAngleIndex + (greenZonesCount + yellowZonesCount) * step) * Math.PI;
        var endRedAngle = (endAngleIndex + 0.02) * Math.PI;

        var sectionOptions = [
            {
                startAngle: startAngle,
                endAngle: endGreenAngle,
                color: "#090"
            },
            {
                startAngle: endGreenAngle,
                endAngle: endYellowAngle,
                color: "#cc0"
            },
            {
                startAngle: endYellowAngle,
                endAngle: endRedAngle,
                color: "#900"
            }
        ];

        this.DrawZone = function(options) {
            ctx.beginPath();
            ctx.arc(middleX, middleY, radius, options.startAngle, options.endAngle, counterClockwise);
            ctx.lineWidth = zoneLineWidth;
            ctx.strokeStyle = options.color;
            ctx.lineCap = "butt";
            ctx.stroke();
        };

        sectionOptions.forEach(function(options) {
            DrawZone(options);
        });
    };
    
var DrawTicks = function() {

        this.DrawTick = function(angle) {
            var fromX = middleX + (radius - tickOffsetFromArc) * Math.cos(angle);
            var fromY = middleY + (radius - tickOffsetFromArc) * Math.sin(angle);
            var toX = middleX + (radius + tickOffsetFromArc) * Math.cos(angle);
            var toY = middleY + (radius + tickOffsetFromArc) * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.lineWidth = tickWidth;
            ctx.lineCap = "round";
            ctx.strokeStyle = tickColor;
            ctx.stroke();
        };

        for (var i = startAngleIndex; i <= endAngleIndex; i += step) {
            var angle = i * Math.PI;
            this.DrawTick(angle);
        }
    };
    
var DrawDigits = function() {
        var angleIndex = startAngleIndex;

        digits.forEach(function(digit) {
            var angle = angleIndex * Math.PI;
            angleIndex += step;
            var x = middleX + (radius - digitsOffsetFromArc) * Math.cos(angle);
            var y = middleY + (radius - digitsOffsetFromArc) * Math.sin(angle);

            ctx.font = digitsFont;
            ctx.fillStyle = digitsColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(digit, x, y);
        });
    };
    
var DrawArrow = function(arrowValueIndex) {
        var arrowAngle = arrowValueIndex * Math.PI;
        var toX = middleX + (radius) * Math.cos(arrowAngle);
        var toY = middleY + (radius) * Math.sin(arrowAngle);

        ctx.beginPath();
        ctx.moveTo(middleX, middleY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = arrowColor;
        ctx.lineWidth = arrowWidth;
        ctx.stroke();
    };

var DrawCenterCircle = function() {
        ctx.beginPath();
        ctx.arc(middleX, middleY, centerCircleRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = centerCircleColor;
        ctx.fill();
        ctx.lineWidth = centerCircleBorderWidth;
        ctx.strokeStyle = arrowColor;
        ctx.stroke();
    };
    
var DrawSpeedometer = function(delay_order) {
        RecallCanvasConstant();
        var arrowValueIndex;
        arrowValueIndex = startAngleIndex + step * (delay_order - 1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawTicks();
        DrawZones();
        DrawDigits();
        DrawArrow(arrowValueIndex);
        DrawCenterCircle();      
};
    
var DrawScoreInformation = function(){
    $.getJSON( "/api/score_information", function( data ) {
        var delay_order = data['max_fulfillment_orders_delay'];
        if(delay_order > 40){
            delay_order = 40;
        }
        DrawSpeedometer(delay_order);
        $(".js-count-fulfillment-orders").text("Необработанных заказов - " + data['count_fulfillment_orders']);
        $(".js-count-completed-orders").text("Всего за день - " + data['count_completed_orders']);
    });
};

var ResizeScoreWindow = function(){
    if($(window).width() > 550){
        canvas.width  = 500;
        canvas.height = 500;
    }else{
        canvas.width  = 300;
        canvas.height = 300;
    }
  };
$(document).ready(function(){
    ResizeScoreWindow();
    DrawScoreInformation();
    $(window).on("resize", function(){                      
        ResizeScoreWindow();
        DrawScoreInformation();
    });
  });
    
var timerId = setInterval(function() {
    DrawScoreInformation();
}, 10000);
