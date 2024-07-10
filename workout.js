function EventObject(data) {
    return {
        data: data
    };
}

function Model() {
    this.locker = localStorage.getItem('locker') || '';

    this.updateModel = function(e) {
        // Update the locker number in the model
        this.locker = e.data.value.trim();
        // Store the updated locker number in localStorage
        localStorage.setItem('locker', this.locker);
        // Notify controller or view of any changes (if needed)
        this.controller.onChangedModel();
    };

    this.init = function() {
        // Initialize the locker number from localStorage
        // No need to set it again here if it's already set in the constructor
    };
}

function View() {
    const lockerInput = document.getElementById("locker");
    const saveButton = document.getElementById("saveButton");

    this.updateView = function() {
        lockerInput.value = localStorage.getItem('locker') || '';
    };

    this.saveLocker = function() {
        let lockerValue = lockerInput.value.trim();
        let e = new EventObject({
            value: lockerValue
        });
        this.controller.onViewEvent(e);
    };

    saveButton.addEventListener("click", this.saveLocker.bind(this));
}

function Controller() {
    this.model = null;
    this.view = null;

    this.onViewEvent = function(e) {
        this.model.updateModel(e);
    };

    this.onChangedModel = function() {
        this.view.updateView();
    };

    this.init = function() {
        this.model.init();
        this.view.updateView();
    };
}

function init() {
    const model = new Model();
    const view = new View();
    const controller = new Controller();

    model.controller = controller;
    view.controller = controller;
    controller.model = model;
    controller.view = view;

    controller.init();
}

window.addEventListener("load", init);
