// Simple event object interface
function EventObject(data)
{
    return {
        data: data
    }
}

function Model()
{
    // 1. Data (state)
    // - Should contain the from scale, to scale, and the current weight
    // e.g., this.weight = ...
    // - Should be initial values as per spec
    this.answer = "";
    this.x = "";
    document.getElementById("weight1").selectedIndex = "0";
    document.getElementById("weight2").selectedIndex = "1";

    // 2. Set what happens when data is changed
    // - state should be changed appropriately (conversions)
    // - Should handle edge cases (e.g., not a number, empty) as per spec
    // - Controller should be notified of the change and sent a 
    // string value representation of data to display
    this.updateModel = function(e)
    {
        let result = "";
        // Error handling
        if (isNaN(Number(e.data.x)))
        {
            result = "Error!";
        }
        else if (e.data.x === ""){
            result = "";
        }
        else if (document.getElementById("weight1").selectedIndex == document.getElementById("weight2").selectedIndex){
            result = Number(e.data.x).toFixed(3);
        }
        else if (document.getElementById("weight1").selectedIndex == "1"){
            result = (Number(e.data.x) / 16).toFixed(3);
        }
        else
        {
            result = (Number(e.data.x) * 16).toFixed(3);
        }

        this.answer = result;
        this.x = e.data.x;
        
        console.log("Updated Model, communicate to Controller")
        // Contact controller
        this.controller.onChangedModel(new EventObject({
            answer: this.answer,
            x: this.x
        }))
    }

    // 3. Called from Controller - initialize model
    // - Should call controller with initial values of from scale, to scale, and the current weight
    this.init = function()
    {
        console.log("-- Begin Type 2 Event --")
        console.log("Initialized Model, communicate to Controller")
        this.controller.onChangedModel(new EventObject({   
            answer: this.answer,
            x: this.x
        }))
    }
}

function View()
{
    // 1. Store view component references (DOM elements)
    // e.g, const elem = document.getElementById("elem")
    const x = document.getElementById("x");
    const answer = document.getElementById("answer");

    // 2. Set event when signalled by controller
    // - Should update the view (components) appropriately 
    this.updateView = function(e)
    {
        console.log("Updated View")
        answer.value = e.data.answer;
        console.log("-- End Type 2 Event --")
    }

    // 3. When the view is modified in some way
    this.onViewEvent = function()
    {
        // Call to this.controller.onViewEvent
        // - Event Object should contain ALL the data necessary to
        // update the model
        // - All component values should be included

        let e = new EventObject({
            x: x.value
        }); 

        console.log("-- Begin Type 2 Event --")
        console.log("View to Controller")
        this.controller.onViewEvent(e);

    }.bind(this); // Binding because context is from DOM Event

    // 4. Set events for when user types into "from" input or when
    // from scale or to scale select element changes
    // - Add event listeners here so when user interacts,
    // the controller should notified (with information)
    // - Consider DOM event objects
    // https://developer.mozilla.org/en-US/docs/Web/API/Event
    this.registerEventListeners = function()
    {
        // Register event listeners
        // e.g., elem.addEventListener(<type>, this.onViewEvent);

        x.addEventListener("input", this.onViewEvent);
        document.getElementById("weight1").addEventListener("input", this.onViewEvent);
        document.getElementById("weight2").addEventListener("input", this.onViewEvent);
    }
}

// Do not modify
function Controller()
{
    // 1. Set what happens when view calls controller
    // - The model should be updated
    this.onViewEvent = function(e)
    {
        // Update/signal model
        this.model.updateModel(e);
    }

    // 2. Set what happens when model calls controller
    // - The view should be updated
    this.onChangedModel = function(e)
    {
        // Update/signal view
        this.view.updateView(e);
    }

    // When controller initializes
    this.init = function()
    {
        // Register the view's event listeners
        this.view.registerEventListeners();
        // Initialize the model
        this.model.init();
    }

}

// Do not modify
function init()
{
    // Create MVC Objects
    const model = new Model();
    const view = new View();
    const controller = new Controller();

    // Connect them
    model.controller = controller;
    view.controller = controller;

    controller.model = model;
    controller.view = view;

    // Let the controller initialize
    controller.init();

}

// Wait until page load then initialize
window.addEventListener("load", init);