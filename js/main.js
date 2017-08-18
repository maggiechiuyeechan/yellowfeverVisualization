import 'babel-polyfill';


$(function(){
  app.init();
  display();
  app.worldMap();
});

const app = {};


  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];

  app.width = window.innerWidth; 
  app.height = window.innerHeight;


app.init = function(){


 var svg = d3.select('#vis').append('svg')
    .attr("width",app.width)
    .attr("height",app.height)
    .append("g")
    .attr("class", "nodes");


  const data = d3.csv('./dummy.csv', (error,d) => {
     if (error) throw error;

     var nodes = [];

     d.forEach(row=>{
      let numOfTravelers = Number(row.numTravelersOutbound);
      let numOfNodes = Math.round(numOfTravelers/5000);
      for(let i=0; i< numOfNodes; i++){
        let newNode = {
          originEndemic : row.originEndemic, 
          destEndemic : row.destEndemic, 
          vaccFrmEndemic : row.vaccFrmEndemic,
          vaccFrmAllCntry: row.vaccFrmAllCntry
        };
        nodes.push(newNode);
      }
     });


    console.log(nodes);


    var doubledHeight = app.height*5;



    var node =svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class","node")


    var eachNode = node.append("circle")
        .attr("r", 5)
        .attr("class", (d)=>{
            if (d.vaccFrmEndemic === "Yes" && d.destEndemic === "TRUE"){return "vacEndYesDestEndTrue"}
            else if (d.vaccFrmEndemic === "Yes" && d.destEndemic === "FALSE") { return "vacEndYesDestEndFalse"}
            else if (d.vaccFrmEndemic === "No" && d.destEndemic === "TRUE") { return "vacEndNoDestEndTrue"}
            else if (d.vaccFrmEndemic === "No" && d.destEndemic === "FALSE") { return "vacEndNoDestEndFalse"}

          })

    var defs = eachNode.append("defs")
      .append("pattern")
      .attr("id", "planeImage")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", "10")
      .attr("height", "10")
      .append("svg:image")
      .attr("xlink:href", "plane.svg")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", "10")
      .attr("height", "10");


      function tickActions(e) {
        eachNode.attr("cx", function(d) { return d.x; }).attr("cy", function(d) { return d.y; });
        // eachNode.attr("transform", nodeTransform);
        // eachLabel.attr("dx",function(d) { return d.x; }).attr("dy", function(d) { return d.y; });
      };

      var maxNodeSize = 20;

      function nodeTransform(d) {
        d.x =  Math.max(maxNodeSize, Math.min(app.width - (50/2 || 16), d.x));
          d.y =  Math.max(maxNodeSize, Math.min(app.height - (50/2 || 16), d.y));
          return "translate(" + d.x + "," + d.y + ")";
      }


      function isolate(force, filter) {
        var initialize = force.initialize;
        force.initialize = function() { initialize.call(force, nodes.filter(filter)); };
        return force;
      }


      ////////////////////////

      ////////////////////////

      // INITIAL FORCESIMULATION////////////

      ////////////////////////

      ////////////////////////
      app.simulation = d3.forceSimulation()
          .nodes(nodes)
          .force("center_force", d3.forceCenter(app.width/2,app.height/2))
          .force("charge", d3.forceManyBody().strength(0))
          .force("vaccFrmEndemicNo", null)
          .force("vaccFrmEndemicYes", null)

          .force("endTosuit", null)
          .force("endToend",null)
          // .force("collide", d3.forceCollide().radius(function(d) { return d.r + 1000; }).strength(100))
          .on("tick", tickActions);


////////////////////////

////////////////////////

// SECTION 1////////////

////////////////////////

////////////////////////


      app.updateSimulation0 = ()=>{


        $(".vacEndYesDestEndTrue").css("fill","#4dc6f3");
        $(".vacEndYesDestEndFalse").css("fill","#4dc6f3");
        $(".vacEndNoDestEndTrue").css("fill","#4dc6f3");
        $(".vacEndNoDestEndFalse").css("fill","#4dc6f3");




        app.simulation= d3.forceSimulation()
                      .nodes(nodes)
                      .force("center_force", d3.forceCenter(app.width/2,app.height/2))
                      .force("charge", d3.forceManyBody().strength(-100))
                      .force("vaccFrmEndemicNo", d3.forceY(app.height/2).strength(1))
                      // .force("vaccFrmEndemicYes", d3.forceY(app.height/2).strength(0))
                      .force("endToend", d3.forceX(app.width/2).strength(1))
                      .on("tick", tickActions);
      }; 



////////////////////////

////////////////////////

// SECTION 2////////////

////////////////////////

////////////////////////




    app.updateSimulation1 = ()=>{

      $(".vacEndYesDestEndTrue").css({"fill":"#f34daf", "opacity": 
        "1"});
      $(".vacEndYesDestEndFalse").css({"fill":"#afd679", "opacity": 
        "1"});
      $(".vacEndNoDestEndTrue").css({"fill":"#f34daf", "opacity": 
        "1"});
      $(".vacEndNoDestEndFalse").css({"fill":"#afd679", "opacity": 
        "1"});


      // console.log("actived1");

      app.simulation
                    // .nodes(nodes)
                    .force("center_force", d3.forceCenter(app.width/2,app.height/2))
                    // .force("charge", d3.forceManyBody().strength(1))
                    .force("charge", d3.forceManyBody().strength(-500))

                    .force("vaccFrmEndemicNo", d3.forceY(app.height/3).strength(1.75))
                    .force("vaccFrmEndemicYes", d3.forceY(app.height/3).strength(1.75))
                    .force("endToend", isolate(d3.forceX(app.width/5), (d)=>{ return d.originEndemic === "TRUE" && d.destEndemic === "TRUE"; }).strength(2.5))
                    .force("endTosuit", isolate(d3.forceX(app.width/2), (d)=>{ return d.originEndemic === "TRUE" && d.destEndemic === "FALSE"; }).strength(2.5))

      }; 




////////////////////////

////////////////////////

// SECTION 3////////////

////////////////////////

////////////////////////

  /////Proof of vaccination

    app.updateSimulation2 = ()=>{

        //Reposition the center force
      // console.log("actived2");
      $(".vacEndYesDestEndTrue").css({"fill":"#4dc6f3", "opacity": 
        "0.1"});
      $(".vacEndYesDestEndFalse").css({"fill":"#4dc6f3", "opacity": 
        "0.1"});
      $(".vacEndNoDestEndTrue").css("fill","#f34daf");
      $(".vacEndNoDestEndFalse").css("fill","#afd679");

      app.simulation
                  .nodes(nodes)
                  .force("center_force", d3.forceCenter(app.width/2,app.height/2))
                  .force("charge", d3.forceManyBody().strength(-100))
                  .force("vaccFrmEndemicNo", isolate(d3.forceY(app.height/4), (d)=>{ return d.vaccFrmEndemic === "No"; }).strength(2))
                  .force("vaccFrmEndemicYes", isolate(d3.forceY(app.height/2), (d)=>{ return d.vaccFrmEndemic === "Yes"; }).strength(2))
                  .force("endToend", isolate(d3.forceX(app.width/5), (d)=>{ return d.originEndemic === "TRUE" && d.destEndemic === "TRUE"; }).strength(2))
                  .force("endTosuit", isolate(d3.forceX(app.width/1.25), (d)=>{ return d.originEndemic === "TRUE" && d.destEndemic === "FALSE"; }).strength(2))
        //Separate the countries with vaccination policies
    };


    app.updateSimulation3 = ()=>{


      //restart
      node = node.data(nodes)
      node.exit().remove();
      // node = svg.selectAll("circle")
      //         .enter()
      //         .append("g")
      //         .attr("class","node") 
      // eachNode = node.append("circle")
      //         .attr("r", 5)
      //         .attr("class", (d)=>{
      //             if (d.vaccFrmEndemic === "Yes" && d.destEndemic === "TRUE"){return "vacEndYesDestEndTrue"}
      //             else if (d.vaccFrmEndemic === "Yes" && d.destEndemic === "FALSE") { return "vacEndYesDestEndFalse"}
      //             else if (d.vaccFrmEndemic === "No" && d.destEndemic === "TRUE") { return "vacEndNoDestEndTrue"}
      //             else if (d.vaccFrmEndemic === "No" && d.destEndemic === "FALSE") { return "vacEndNoDestEndFalse"}
      //           })



      app.simulation
                  .nodes(node)
                  .force("center_force", d3.forceCenter(app.width/2,app.height/2))
                  // .force("charge", d3.forceManyBody().strength(1))
                  // .force("charge", d3.forceManyBody().strength(1))
                  .force("charge", d3.forceManyBody().strength(-500))

                  .force("vaccFrmEndemicNo", null)
                  .force("vaccFrmEndemicYes", null)
                  .force("endToend", null)
                  .force("endTosuit",  null)
        //Separate the countries with vaccination policies
    }; //updateSimulation3


  });//CSV function
}



app.worldMap = function(){

  var projection = d3.geoMercator()
  .translate([app.width/2,app.height/2.5])
  .scale(app.width/6);

  var coordinates = [
    projection([18, -9]), // new york
    projection([121, 31]) // moscow
  ];


  var path = d3.geoPath()
    .projection(projection);

  var svg = d3.select("#worldMap").append("svg")
    .attr("width", app.width)
    .attr("height",app.height);


    d3.json("./data/countrieswithoutATA.json", (error,world)=>{

  var listOfEndemicCountries = ["Colombia","Brazil","Panama","Colombia","Brazil","Panama","Brazil","Nigeria","Ghana", "Ivory Coast","Kenya","Senegal","Cameroon","Venezuela","Gabon","Democratic Republic of the Congo","Benin", "Mali","Paraguay","Uganda","Angola","Bolivia","Republic of Congo","Burkina Faso","Togo","South Sudan","Sudan"]
      // listOfEndemicCountries.includes(d.properties.ADMIN)
  var listOfSuitableCountries = ["United States Minor Outlying Islands", "United States of America", "Mexico", "United Arab Emirates", "Peru", "Ecuador", "Dominican Republic","Brazil", "Venezuela","China","India","Cuba","Saudi Arabia","Costa Rica","United Republic of Tanzania","Egypt","Argentina","Rwanda","Guatemala","El Salvador","Hong Kong S.A.R.","Thailand"]


      svg.selectAll(".countries")
        .data(topojson.feature(world, world.objects.countrieswithoutATA).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "countries")
        .style("fill", "#f3f3f5")
        // .style("fill", function(d){
        //     if (listOfEndemicCountries.includes(d.properties.ADMIN))
        //         {return "#f34daf"}
        //     else if (listOfSuitableCountries.includes(d.properties.ADMIN)){return "#afd679"}
        //       else { return "#f3f3f5"}
        // })
        // .style("stroke", function(d){
        //     if (listOfEndemicCountries.includes(d.properties.ADMIN))
        //         {return "#f34daf"}
        //     else if (listOfSuitableCountries.includes(d.properties.ADMIN)){return "#afd679"}
        //       else { return "#fff"}
        // });

        d3.csv("./data/suitable.csv", function(d) {
          svg.selectAll("circle")
            .data(d)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projection([d.Long_, d.Lat])[0];
            })
            .attr("cy", function (d) {
                return projection([d.Long_, d.Lat])[1];
            })
            .attr("class", "suitableCirclesMap" )
        });


        d3.csv("./data/endemic.csv", function(d) {
          svg.selectAll("circle")
            .data(d)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projection([d.Long_, d.Lat])[0];
            })
            .attr("cy", function (d) {
                return projection([d.Long_, d.Lat])[1];
            })
            .attr("class", "endemicCirclesMap" )
        });


        var line = svg.append("path")
          .datum(coordinates)
          .attr("d", function(c) {
            var d = {
              source: c[0],
              target: c[1]
            };
            var dx = d.target[0] - d.source[0],
              dy = d.target[1] - d.source[1],
              dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source[0] + "," + d.source[1] + "A" + dr + "," + dr +
              " 0 0,1 " + d.target[0] + "," + d.target[1];
          })
          .style("stroke", "black")
          .style("stroke-width", 3)
          .style("fill", "none")
          .attr("class","flightLine")
          .transition()
          .duration(2000)
          .attrTween("stroke-dasharray", function() {
            var len = this.getTotalLength();
            return function(t) {
              return (d3.interpolateString("0," + len, len + ",0"))(t)
            };
          })
          .on('end', function(d) {
            var c = coordinates[1];
            svg.append('circle')
              .attr('cx', c[0])
              .attr('cy', c[1])
              .attr('r', 15)
              // .style("stroke", "black")
              // .style("stroke-width", 2)
              .style("fill", "#4dc6f3")
              .attr('class', "destinationCircle")
              // .transition()
              // .duration(1000)
              // .attr('r', 50)
              // .on('end', function(d) {
              //   d3.select(this)
              //     .transition()
              //     .duration(2000)
              //     .attr('r', 10);
              // });
          });
    });


} ///world map function


function display() {

  // create a new plot and
  // display it

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

      // console.log(index);

      if(index==0 ){
        $("#vis").css("opacity", "0");
        $("#worldMap").css("opacity", "1");
      }else if (index==1){
        app.updateSimulation0();
        $("#vis").css("opacity", "1");
        $("#worldMap").css("opacity", "0");
      }else if(index==2){
         app.updateSimulation1();
        $("#vis").css("opacity", "1");
        $("#worldMap").css("opacity", "0");

      }else if(index==3){
        app.updateSimulation2();
        $("#vis").css("opacity", "1");
        $("#worldMap").css("opacity", "0");

      }else if(index==4){
        app.updateSimulation0();
        $("#vis").css("opacity", "0");
        $("#worldMap").css("opacity", "1");
      }

    // activate current section
    // plot.activate(index);
  });
}




function scroller() {
  var container = d3.select('body');
  // event dispatcher
  var dispatch = d3.dispatch('active', 'progress');

  // d3 selection of all the
  // text sections that will
  // be scrolled through
  var sections = null;

  // array that will hold the
  // y coordinate of each section
  // that is scrolled through
  var sectionPositions = [];
  var currentIndex = -1;
  // y coordinate of
  var containerStart = 0;

  /**
   * scroll - constructor function.
   * Sets up scroller to monitor
   * scrolling of els selection.
   *
   * @param els - d3 selection of
   *  elements that will be scrolled
   *  through by user.
   */
  function scroll(els) {
    sections = els;

    // when window is scrolled call
    // position. When it is resized
    // call resize.
    d3.select(window)
      .on('scroll.scroller', position)
      .on('resize.scroller', resize);

    // manually call resize
    // initially to setup
    // scroller.
    resize();

    // hack to get position
    // to be called once for
    // the scroll position on
    // load.
    // @v4 timer no longer stops if you
    // return true at the end of the callback
    // function - so here we stop it explicitly.
    var timer = d3.timer(function () {
      position();
      timer.stop();
    });
  }

  /**
   * resize - called initially and
   * also when page is resized.
   * Resets the sectionPositions
   *
   */
  function resize() {
    // sectionPositions will be each sections
    // starting position relative to the top
    // of the first section.
    sectionPositions = [];
    var startPos;
    sections.each(function (d, i) {
      var top = this.getBoundingClientRect().top;
      if (i === 0) {
        startPos = top;
      }
      sectionPositions.push(top - startPos);
    });
    containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
  }

  /**
   * position - get current users position.
   * if user has scrolled to new section,
   * dispatch active event with new section
   * index.
   *
   */

  function position() {
    var pos = window.pageYOffset - app.height/1.5 - containerStart;
    var sectionIndex = d3.bisect(sectionPositions, pos);
    sectionIndex = Math.min(sections.size() - 1, sectionIndex);

    if (currentIndex !== sectionIndex) {
      // @v4 you now `.call` the dispatch callback
      dispatch.call('active', this, sectionIndex);
      currentIndex = sectionIndex;
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
    // @v4 you now `.call` the dispatch callback
    dispatch.call('progress', this, currentIndex, progress);
  }

  /**
   * container - get/set the parent element
   * of the sections. Useful for if the
   * scrolling doesn't start at the very top
   * of the page.
   *
   * @param value - the new container value
   */
  scroll.container = function (value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  // @v4 There is now no d3.rebind, so this implements
  // a .on method to pass in a callback to the dispatcher.
  scroll.on = function (action, callback) {
    dispatch.on(action, callback);
  };

  return scroll;
}
