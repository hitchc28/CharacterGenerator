// Module, Controller
var app = angular.module('characterApp', []);

// Objects
// Question
app.factory('Question', function (Choice) {

    // Constructors
    function Question() {
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

app.controller('characterCtrl', function ($scope, $filter, Question, Trait, Character, Game, Attribute) {

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