// Module, Controller
var app = angular.module('characterApp', ["ngStorage"]);

// Global variable: Unique int identifier for each custom object
var count = 0;

// Objects
// Question
app.factory('Question', function (Choice) {

    // Constructors
    function Question() {
        this.id = count++;
        this.type = "Question";
        this.name = '';
        this.choices = [];
    }

    // Public methods
    Question.prototype.addChoice = function (ch) {
        this.choices.push(ch);
    };
    Question.prototype.removeChoice = function (ch) {
        this.choices = this.choices.filter(function (c) {
            return c !== ch;
        });
    };
    Question.prototype.newChoice = function () {
        var ch = new Choice();
        this.addChoice(ch);
    };
    // Purpose: Choose choice from choices based on game mode
    // Returns: Choice object
    Question.prototype.decide = function () {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    };

    // Private properties

    // Private methods

    // Static properties

    // Static methods

    // Testing
    Question.prototype.testChoice = function () {
        var ch = new Choice();
        this.addChoice(ch);
    }

    return Question;
});
// Choice
app.factory('Choice', function (Trait) {

    // Constructors
    function Choice() {
        this.id = count++;
        this.type = "Choice";
        this.name = '';
        this.addAttributes = [];
    }

    // Public methods
    Choice.prototype.addAddAttribute = function (a) {
        this.addAttributes.push(a);
    };
    Choice.prototype.removeAddAttribute = function (a) {
        this.addAttributes = this.addAttributes.filter(function (att) {
            return a !== att;
        });
    };

    // Private properties

    // Private methods

    // Static properties

    // Static methods

    return Choice;
});
// Attribute
app.factory('Attribute', function () {

    // Constructors
    function Attribute(owner) {
        this.id = count++;
        this.type = "Attribute";
        this.name = '';
        this.trait = owner;
    }

    // Public methods

    // Private properties

    // Private methods

    // Static properties

    // Static methods

    return Attribute;
});
// Trait
app.factory('Trait', function (Attribute) {

    // Constructors
    function Trait() {
        this.id = count++;
        this.type = "Trait";
        this.name = '';
        this.attributes = [];
    }

    // Public methods
    Trait.prototype.addAttribute = function (a) {
        this.attributes.push(a);
        a.trait = this;
    };
    Trait.prototype.removeAttribute = function (a) {
        this.attributes = this.attributes.filter(function (att) {
            return a !== att;
        });
    };
    Trait.prototype.newAttribute = function () {
        var a = new Attribute(this);
        this.addAttribute(a);
    };

    // Private properties

    // Private methods

    // Static properties

    // Static methods

    return Trait;
});
// Character
app.factory('Character', function (Question, Choice) {

    // Constructors
    function Character() {
        this.id = count++;
        this.type = "Character";
        this.attributes = {};
    }

    // Public methods
    Character.prototype.addAttribute = function (att) {
        if (!(att.trait.name in this.attributes)) {
            this.attributes[att.trait.name] = [];
        }
        this.attributes[att.trait.name].push(att);
    }
    // Purpose: Apply terms of choice to character
    // Parameters: char - Character object being altered
    Character.prototype.makeChoice = function (choice) {
        var char = this;
        choice.addAttributes.forEach(function (att) {
            char.addAttribute(att);
        });
    }

    // Private properties

    // Private methods

    // Static properties

    // Static methods

    return Character;
});
// Game
app.factory('Game', function (Character, Question, Choice) {

    // Constructors
    function Game() {
        this.id = count++;
        this.type = "Game";
    };

    // Public methods
    Game.prototype.play = function (char, questions) {
        // Get choice from each active question
        questions.forEach(function (question) {
            var choice = question.decide(this);
            char.makeChoice(choice);
        });
    };

    // Private properties

    // Private methods

    // Static properties

    // Static methods

    return Game;
});

app.controller('characterCtrl', function ($scope, $filter, Question, Trait, Choice, Attribute, Character, Game, $window, $localStorage) {

    // Questions
    $scope.questions = [];
    $scope.addQuestion = function (q) {
        $scope.questions.push(q);
    };
    $scope.removeQuestion = function (q) {
        $scope.questions = $scope.questions.filter(function (qu) {
            return q !== qu;
        });
    };
    $scope.newQuestion = function () {
        var q = new Question();
        $scope.addQuestion(q);
    };

    // Traits
    $scope.traits = [];
    $scope.addTrait = function (t) {
        $scope.traits.push(t);
    };
    $scope.removeTrait = function (t) {
        $scope.traits = $scope.traits.filter(function (tr) {
            return t !== tr;
        });
    };
    $scope.newTrait = function () {
        var t = new Trait();
        $scope.addTrait(t);
    };

    // Gameplay
    $scope.activeCharacter = {};
    $scope.activeGame = {};
    $scope.play = function () {
        $scope.activeCharacter = new Character();
        $scope.activeGame = new Game();
        $scope.activeGame.play($scope.activeCharacter, $scope.questions);
        $scope.changeMenu(7);
    };

    // Menu logic
    $scope.activeQuestion = {};
    $scope.setActiveQuestion = function (q) {
        $scope.activeQuestion = q;
    }

    $scope.activeChoice = {};
    $scope.setActiveChoice = function (ch) {
        $scope.activeChoice = ch;
    }

    $scope.activeTrait = {};
    $scope.setActiveTrait = function (t) {
        $scope.activeTrait = t;
    }

    // Session information
    // Purpose: Save all game objects (Questions, Traits, Choices, Attributes) to local session.
    $scope.Save = function () {

        // Build list of objects to save
        var toSave = $scope.BuildToSave();

        // For each object to save
        angular.forEach(toSave, function (obj, objKey) {
            // Make copy
            var copy = angular.copy(obj);
            // Process each key, value and replace objects with ID references
            angular.forEach(copy, function (value, key) {
                // If object, replace references
                if ($scope.IsObject(value)) {
                    copy[key] = "ID Ref: " + value.id;
                }
                // If array, test each element
                if (angular.isArray(value)) {
                    angular.forEach(value, function (arrayValue, arrayKey) {
                        if ($scope.IsObject(arrayValue)) {
                            value[arrayKey] = "ID Ref: " + arrayValue.id;
                        }
                    });
                }
            });
            // Store altered object as object to save
            toSave[objKey] = copy;
        });

        // Save to local storage
        //var test = angular.toJson(toSave);
        //$window.alert(angular.toJson(toSave));
        $localStorage.Build = angular.toJson(toSave);
    }
    // Purpose: Build array of objects to be saved
    // Returns: Array of objects
    $scope.BuildToSave = function(){
        var toSave = [];

        // Add each question
        $scope.questions.forEach(function (q) {
            toSave.push(q);

            // Add each choice
            q.choices.forEach(function (ch) {
                toSave.push(ch);
            });
        });
        // Add each trait
        $scope.traits.forEach(function (tr) {
            toSave.push(tr);

            // Add each attribute
            tr.attributes.forEach(function (att) {
                toSave.push(att);
            });
        });

        return toSave;
    }
    // Purpose: Test if an object is a custom type
    // Returns: (bool) True if custom object
    $scope.IsObject = function (obj) {
        if (!(obj.hasOwnProperty('id'))) return false;
        if (!(obj.hasOwnProperty('type'))) return false;
        return true;
    }

    // Purpose: Retrieve game objects from local session.
    $scope.Get = function () {
        // Working test
        //$window.alert($localStorage.Build);

        // Reset count
        count = 0;

        // Get data from local storage
        var data = angular.fromJson($localStorage.Build);
        var sortedObjects = []; // All objects, using id number as index

        // For each object in data, build object using factory
        angular.forEach(data, function (objValue, objKey) {
            // Create object of type, merge with data object
            var obj = $scope.BuildLoadObject(objValue);
            objValue = angular.merge(obj, objValue);

            // Save based on id index
            sortedObjects[objValue.id] = objValue;

            // Update count
            count++;
        });
        // For each object, restore references
        angular.forEach(sortedObjects, function (sortObj, sortKey) {
            // Loop over each key
            angular.forEach(sortObj, function (value, key) {
                // If array, loop
                angular.forEach(value, function (stringValue, stringKey) {
                    if (typeof stringValue === 'string' || stringValue instanceof String) {
                        if (stringValue.indexOf("ID Ref: ") != -1) {
                            var id = stringValue.replace("ID Ref: ", "");
                            sortObj[key][stringKey] = sortedObjects[id];
                        }
                    }
                });
                // If object, look up object by id, restore reference
                if (typeof value === 'string' || value instanceof String) {
                    if (value.indexOf("ID Ref: ") != -1) {
                        var id = value.replace("ID Ref: ", "");
                        sortObj[key] = sortedObjects[id];
                    }
                }
            });
        });

        // Save results in controller
        $scope.AssignLoadedObjects(sortedObjects);
    }
    // Purpose: Return blank object of certain type based on obj
    // Returns: Default factory object of obj.type type
    $scope.BuildLoadObject = function (obj) {
        switch(obj.type) {
            case "Question":
                return new Question();
                break;
            case "Trait":
                return new Trait();
                break;
            case "Choice":
                return new Choice();
                break;
            case "Attribute":
                return new Attribute();
                break;
            default:
                return {};
        }
    }
    // Purpose: Take loaded objects and use for project-specific purpose
    // Specific: Save loaded questions and traits in scope
    $scope.AssignLoadedObjects = function (loadedArray) {
        // Reset data
        $scope.questions = [];
        $scope.traits = [];

        // Loop through data, save specific types separately
        angular.forEach(loadedArray, function (obj, key) {
            if (obj.type == "Question") {
                $scope.addQuestion(obj);
            }
            else if (obj.type == "Trait") {
                $scope.addTrait(obj);
            }
        });
    }

    $scope.testObj = {name:"Hello", data:"World"};

    // Only show one menu at a time
    $scope.menuIndex = 0;
    $scope.changeMenu = function (index) {
        // 0: Main Menu
        // 1: Edit Question
        // 2: Edit Choice
        // 3: Edit Trait
        // 4: Show Questions
        // 5: Show Traits
        // 6: Playing
        // 7: Show Character
        $scope.menuIndex = index;
    };

    // Testing

});