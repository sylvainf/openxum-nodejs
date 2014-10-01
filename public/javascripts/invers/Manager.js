"use strict";

Invers.Manager = function (e, gui_player, other_player) {

// public methods
    this.load_level = function () {
        var key = 'openxum:invers:level';

        level = 10;
        if (localStorage[key]) {
            level = JSON.parse(localStorage[key]);
        }
        return level;
    };

    this.play = function () {
        if (engine.current_color() === gui.color()) {
            if (engine.phase() === Invers.Phase.PUSH_TILE && gui.get_move()) {
                move = gui.get_move();
                apply_move(move);
                if (other.is_remote()) {
                    other.move(move);
                }
                gui.unselect();
            }
        }
        gui.draw();
        finish();
        if (!engine.is_finished() && engine.current_color() !== gui.color()) {
            if (!other.is_remote()) {
                this.play_other();
            }
        }
    };

    this.play_other = function () {
        if (engine.phase() === Invers.Phase.PUSH_TILE) {
            if (other.is_remote() || (other.is_remote() && other.is_ready())) {
                move = other.move();
            }
            if (!other.is_remote()) {
                move = other.move();
                apply_move(move);
                if (other.is_remote() && other.confirm()) {
                    other.move(move);
                }
                gui.unselect();
            }
        }
        gui.draw();
        finish();
        if (!engine.is_finished() && engine.current_color() !== gui.color()) {
            if (!other.is_remote()) {
                this.play_other();
            }
        }
    };

    this.play_remote = function(move) {
        apply_move(move);
        gui.draw();
        finish();
    };

    this.redraw = function () {
        gui.draw();
    };

// private methods
    var apply_move = function (move) {
        engine.move(move);
        moves += move.get() + ';';
    };

    var finish = function () {
        if (engine.is_finished()) {
            var popup = document.getElementById("winnerModalText");

            popup.innerHTML = "<h4>The winner is " +
                (engine.winner_is() === Invers.Color.RED ? "red" : "yellow") + "!</h4>";
            $("#winnerModal").modal("show");

            if (engine.winner_is() === gui.color()) {
                var win = load_win() + 1;

                localStorage['openxum:invers:win'] = JSON.stringify(win);
                if (win > 5) {
                    localStorage['openxum:invers:level'] = JSON.stringify(level + 10);
                    localStorage['openxum:invers:win'] = JSON.stringify(0);
                }
            }
        }
    };

    var load_win = function () {
        var key = 'openxum:invers:win';
        var win = 0;

        if (localStorage[key]) {
            win = JSON.parse(localStorage[key]);
        }
        return win;
    };

    var init = function (e, g, o) {
        engine = e;
        gui = g;
        other = o;
    };

// private attributes
    var engine;
    var gui;
    var other;

    var level;

    var move;
    var moves;

    init(e, gui_player, other_player);
};