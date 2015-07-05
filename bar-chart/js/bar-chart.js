var barChartProperties = {
    backgroundColor: "#F7F7F8",
    barBackgroundColor: "#596574",
    data:[
        {"val": 23,"lbl": "Scheduled"},
        {"val": 32,"lbl": "Peer Review"},
        {"val": 36, "lbl": "Level Approval",
            "subLevel":[
                {"val": 18,"lbl": "Level 1"},
                {"val": 9, "lbl": "Level 2"},
                {"val": 6, "lbl": "Level 3"},
                {"val": 3, "lbl": "Level 4"}
            ]
        },
        {"val": 42,"lbl": "Custodian Processing"},
        {"val": 133,"lbl": "Completed"}
    ],
    style:{
        svgClass: "svg-style",
        subSectionClass: "sub-bar-graph"
    },
    barColors: ["#FFBA2A","#A788C3","#9EC42E","#39AAE1","#A8CA46"],
    barPadding: 20,
    bottomCricleRadius: 30
}

var charts;
(function (charts) {
    var BarChart = (function () {
        function BarChart(barChartProperties) {
            var svg,
                nmspace = "http://www.w3.org/2000/svg",
                instantiate,
                properties = barChartProperties,
                boxWidth = 1000,
                boxHeight = 281,
            instantiate = function () {
                svg = document.createElementNS(nmspace, "svg");
                svg.setAttributeNS(null, "width", boxWidth);
                svg.setAttributeNS(null, "height", boxHeight);
                svg.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
                svg.setAttributeNS(null, "class", properties.style.svgClass);
            };
            instantiate();
            
            // Creating Rectangle using SVG
            var createRect = function(oRectProperties, index) {
                var oRect = document.createElementNS(nmspace, "rect");
                oRect.setAttributeNS(null, "x", oRectProperties.iX);
                oRect.setAttributeNS(null, "y", oRectProperties.iY);
				
                oRect.setAttributeNS(null, "rx", oRectProperties.irX);
                oRect.setAttributeNS(null, "ry", oRectProperties.irY);
				
                oRect.setAttributeNS(null, "width", oRectProperties.iWidth);
                oRect.setAttributeNS(null, "height", oRectProperties.iHeight);
                oRect.setAttributeNS(null, "style", oRectProperties.sStyle);
                index === 0 && oRectProperties.parent ? oRect.setAttributeNS(null, 'opacity', '0.9') : "";                
                if(oRectProperties.eClick){
                    oRect.addEventListener("click", function (event) {
                        var allRectElements = document.getElementsByTagName("rect");
                        for(var iCounter = 0; iCounter < allRectElements.length; iCounter++){
                            allRectElements[iCounter].removeAttributeNS(null, 'opacity');
                        }
                        oRectProperties.parent ? this.setAttributeNS(null, 'opacity', '0.9') : this.previousSibling.setAttributeNS(null, 'opacity', '0.9');
                        var lineElement = document.getElementsByTagName("line");
                        lineElement[0].setAttributeNS(null,'x1', iRectWidth * index);
                        lineElement[0].setAttributeNS(null,'x2', iRectWidth * (index+1));
                    }, true);
                }
                return oRect;   
            };
            
            var createCricle = function(oCricleProperties){
                var oCricle = document.createElementNS(nmspace, "circle");
                oCricle.setAttributeNS(null, "cx", oCricleProperties.cX);
                oCricle.setAttributeNS(null, "cy", oCricleProperties.cY);
                oCricle.setAttributeNS(null, "r", oCricleProperties.r);
                oCricle.setAttributeNS(null, "style", oCricleProperties.sStyle);
                if(oCricleProperties.clickEvent){
                    oCricle.addEventListener("mouseenter", function (event) {
                        var allgElements = document.getElementsByTagName("g");
                        allgElements[0].setAttributeNS(null, 'style', "display:block;");
                    }, true);
                    oCricle.addEventListener("mouseout", function (event) {
                        var allgElements = document.getElementsByTagName("g");
                        allgElements[0].setAttributeNS(null, 'style', "display:none;");
                    }, true);
                }
                return oCricle;
            };
            
            var createText = function(tX, tY, value, textAnchor){
                textAnchor = !!textAnchor ? textAnchor :"middle";
                var oText = document.createElementNS(nmspace, "text");
                oText.appendChild(document.createTextNode(value));
                oText.setAttributeNS(null, "dx", tX);
                oText.setAttributeNS(null, "dy", tY);
                oText.setAttributeNS(null, "text-anchor", textAnchor);
                oText.setAttributeNS(null, "style", "font-size:19px;fill:#395775;");
                return oText;
            };
            var createLine = function(x1, y1, x2, y2, sStyle){
                var oLine = document.createElementNS(nmspace, "line");
                oLine.setAttributeNS(null, "x1", x1);
                oLine.setAttributeNS(null, "y1", y1);
                oLine.setAttributeNS(null, "x2", x2);
                oLine.setAttributeNS(null, "y2", y2);
                oLine.setAttributeNS(null, "style", "stroke:#395775;stroke-width:4");
                return oLine;
            
            }
            var getMaxValue = function(arr, propertyName){
                return Math.max.apply(null, arr.map(function(item){
                    return item[propertyName];
                }));
            }
            
            var createSubBarChart = function(subLevelProperties, parentProperties){
                var gElem = document.createElementNS(nmspace, "g");
                gElem.setAttributeNS(null, "class", properties.style.subSectionClass);
                gElem.setAttributeNS(null, 'style', "display:none;");
                gElem.setAttributeNS(null, "fill", "#fff");
                
                var oBackgroundRect = {
                        iX: parentProperties.iX,
                        iY: parentProperties.iHeight -20 - 5,
                        iWidth: parentProperties.iWidth,
                        iHeight: (subLevelProperties.length+1)*20 + properties.barPadding,
                        sStyle: "fill:#fff",
						irX: 10,
						irY: 10,
                        eClick: false,
                        parent: false
                };
                
                gElem.appendChild(createRect(oBackgroundRect));
                var maxValue = getMaxValue(subLevelProperties, 'val');
                
                var iCurrentY = parentProperties.iHeight - properties.barPadding;
                
                subLevelProperties.forEach(function(value, index){
                    gElem.appendChild(createText(parentProperties.iX+5 , iCurrentY+15, value.lbl, "start"));
                    
                    var oRectProp = {
                        iX: parentProperties.iX+70,
                        iY: iCurrentY,
                        iWidth: parentProperties.iWidth/3,
                        iHeight: 20,
                        sStyle: "fill:#DEE0E3",
                        eClick: false,
                        parent: false
                    };
                    gElem.appendChild(createRect(oRectProp, index));
                    var iRectWidth = (parentProperties.iWidth/3 - properties.barPadding)* value.val /maxValue;
                    
                    oRectProp.iWidth = iRectWidth;
                    oRectProp.sStyle = "fill:#99C221";
                    gElem.appendChild(createRect(oRectProp, index));
                    gElem.appendChild(createText(oRectProp.iX + parentProperties.iWidth/3 +10, iCurrentY+15, value.val));
                    
                    iCurrentY += 1.5*properties.barPadding;
                });
                return gElem;
            }
                                           
            this.RenderChart = function (target) {
                document.querySelector(target).appendChild(svg);
                iTotalBars = properties.data.length;
                iRectWidth = boxWidth/iTotalBars;
                iCurrentX = 0;
                
                // To find maximum value
                var maxValue = getMaxValue(properties.data, 'val');

                properties.data.forEach(function(value, index){
                    var oBackgroundRect = {
                        iX: iCurrentX,
                        iY: 0,
						irX: 0,
						irY: 0,
                        iWidth: iRectWidth,
                        iHeight: boxHeight - 3*properties.barPadding,
                        sStyle: "fill:"+properties.barBackgroundColor,
                        eClick: true,
                        parent: true
                    };
                    svg.appendChild(createRect(oBackgroundRect, index));
                    
                    iRectHeight = ( boxHeight - 5*properties.barPadding) * value.val /maxValue
                    var oDataRect = {
                        iX: iCurrentX + properties.barPadding,
                        iY: boxHeight - iRectHeight - 3*properties.barPadding,
                        iWidth: iRectWidth - (2*properties.barPadding),
                        iHeight: iRectHeight,
                        sStyle: "fill:"+properties.barColors[index],
                        eClick: true,
                        parent: false
                    };
                    svg.appendChild(createRect(oDataRect, index));
                    
                    var oBottomCricle = {
                        cX: iCurrentX + (iRectWidth/2),
                        cY: boxHeight - 2.5*properties.barPadding,
                        r: properties.bottomCricleRadius,
                        sStyle: "fill:"+properties.backgroundColor 
                    };
                    svg.appendChild(createCricle(oBottomCricle));
                    svg.appendChild(createText(oBottomCricle.cX, oBottomCricle.cY, value.val));
                    svg.appendChild(createText(oBottomCricle.cX, boxHeight-properties.barPadding, value.lbl));
                    
                    if(value.subLevel && value.val){
                        svg.appendChild(createSubBarChart(value.subLevel, oDataRect));
                        var oTopCricle = {
                            cX: oDataRect.iX+ oDataRect.iWidth - properties.barPadding,
                            cY: oDataRect.iY,
                            r: 10,
                            sStyle: "fill:#fff",
                            clickEvent: true
                        };
                        svg.appendChild(createCricle(oTopCricle));
                    }
                    iCurrentX += iRectWidth;
                });
                svg.appendChild(createLine(iRectWidth *0, boxHeight,iRectWidth *1, boxHeight));
            }
        }
        return BarChart;
    })();
    charts.BarChart = BarChart;
})(charts || (charts = {}));


window.onload = function(){
    var a = new charts.BarChart(barChartProperties);
    a.RenderChart(".bar-chart");
}