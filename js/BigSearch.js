/**
 * Created by victor on 9/8/15.
 */

export var BigSearch = (function () {
    var vm = {};
    var api = {};

    vm.init = function () {

    };

    api.controller = function () {

    };

    api.view = function (ctrl) {
        var v =
        {<div class="col-md-6 col-md-offset-3">
                <form action="">
                    <div class="form-group">
                        <label for="from">Från</label>
                        <input type="text" class="form-control input-lg" id="from">
                    </div>
                    <div class="form-group">
                        <label for="to">Till</label>
                        <input type="text" class="form-control input-lg" id="to">
                    </div>

                    <label class="radio-inline">
                        <input type="radio" name="timeSet" id="avg" value="avg" checked="checked"> Avgår
                    </label>
                    <label class="radio-inline">
                        <input type="radio" name="timeSet" id="ank" value="ank"> Ankommer
                    </label>

                    <div class="row">
                        <div class="col-md-7">
                            <select class="form-control">
                                <option>I dag</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                        <div class="col-md-5 form-inline">
                            <label class="pull-right">
                                Klockan:
                                <input type="time" value="" class="form-control">
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-lg btn-block">Sök</button>
                </form>
            </div>};
                        return v;
    };

    return api;

})();
