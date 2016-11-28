/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisenseLibrary.js" />


Aspectize.Extend("BootstrapSlider", {

    Properties: { InitialValues: '0', V1: 0, V2: 0, MinValue: 0, MaxValue: 100, Step: 1, Orientation: 'horizontal', Enabled: true, Ticks: "", TickLabels: "" },
    Events: ['OnV1Changed', 'OnV2Changed'],
    Init: function (elem) {

        var optionMap = { MinValue: 'min', MaxValue: 'max', Step: 'step', Orientation: 'orientation' };
        var theSlider = null;

        var hasTwoValues = false;
        var initialBinding = true;

        function buildNewSlider() {

            function getInitialValues() {

                var values = null;

                if (initialBinding) {

                    var initialValues = Aspectize.UiExtensions.GetProperty(elem, 'InitialValues');
                    var sValues = initialValues.split(',');

                    hasTwoValues = (sValues.length === 2);

                    var v1 = Number(sValues[0]);
                    var v2 = hasTwoValues ? Number(sValues[1]) : 0;

                    if (isNaN(v1) || isNaN(v2) || sValues.length > 2) {

                        Aspectize.Throw(elem.id + ' BootstrapSlider : InitialValues can only be set to a comma seperated string of one or two numbers ! You have : "' + initialValues + '".');
                    }

                    values = [v1];
                    if (hasTwoValues) values.push(v2);

                } else {

                    values = [Aspectize.UiExtensions.GetProperty(elem, 'V1')];
                    if (hasTwoValues) values.push(Aspectize.UiExtensions.GetProperty(elem, 'V2'));
                }

                return values;
            }

            if (theSlider) theSlider.destroy();

            var value = 0;

            var values = getInitialValues();

            if (values) {

                value = hasTwoValues ? values : values[0];

                Aspectize.UiExtensions.ChangeProperty(elem, 'V1', values[0]);
                Aspectize.UiExtensions.Notify(elem, 'OnV1Changed', values[0]);

                if (hasTwoValues) {

                    Aspectize.UiExtensions.ChangeProperty(elem, 'V2', values[1]);
                    Aspectize.UiExtensions.Notify(elem, 'OnV2Changed', values[1]);
                }
            }

            var options = { value: value };
            for (var p in optionMap) {

                options[optionMap[p]] = Aspectize.UiExtensions.GetProperty(elem, p);
            }

            var sTicks = Aspectize.UiExtensions.GetProperty(elem, 'Ticks');
            if (sTicks) {

                var parts = sTicks.split(',');
                var ticks = [];
                for (var n = 0; n < parts.length; n++) {

                    ticks.push(Number(parts[n].trim()));
                }
                options.ticks = ticks;
            }

            var sLabels = Aspectize.UiExtensions.GetProperty(elem, 'TickLabels');
            if (sLabels) {

                options.ticks_labels = sLabels.split(',');
            }

            theSlider = new Slider(elem, options);


            theSlider.on('slideStop', function (x) {

                var v = theSlider.getValue();
                if (hasTwoValues) {

                    var v1 = v[0];
                    var V1 = Aspectize.UiExtensions.GetProperty(elem, 'V1');

                    if (v1 !== V1) {
                        Aspectize.UiExtensions.ChangeProperty(elem, 'V1', v1);
                        Aspectize.UiExtensions.Notify(elem, 'OnV1Changed', v1);
                    }

                    var v2 = v[1];
                    var V2 = Aspectize.UiExtensions.GetProperty(elem, 'V2');

                    if (v2 !== V2) {

                        Aspectize.UiExtensions.ChangeProperty(elem, 'V2', v2);
                        Aspectize.UiExtensions.Notify(elem, 'OnV2Changed', v2);
                    }

                } else {

                    Aspectize.UiExtensions.ChangeProperty(elem, 'V1', v);
                    Aspectize.UiExtensions.Notify(elem, 'OnV1Changed', v);
                }
            });

        }

        buildNewSlider();

        var currentOptions = theSlider.getAttribute();

        Aspectize.UiExtensions.AddMergedPropertyChangeObserver(elem, function (sender, arg) {

            var refresh = false;
            var currentOptions = theSlider.getAttribute();

            if (arg.Ticks || arg.TickLabels || arg.InitialValues) {

                buildNewSlider();

            } else {

                for (var p in arg) {

                    switch (p) {

                        case 'V1': {

                            if (hasTwoValues) {

                                theSlider.setValue([arg.V1, Aspectize.UiExtensions.GetProperty(elem, 'V2')]);

                            } else theSlider.setValue(arg.V1);

                        } break;

                        case 'V2': {

                            theSlider.setValue([Aspectize.UiExtensions.GetProperty(elem, 'V1'), arg.V2]);

                        } break;

                        case 'Enabled': {

                            if (arg.Enabled && !currentOptions.enabled) {

                                theSlider.enable();

                            } else if (!arg.Enabled && currentOptions.enabled) {

                                theSlider.disable();
                            }

                        } break;

                        default: {

                            if (p in optionMap) {

                                theSlider.setAttribute(optionMap[p], arg[p]);
                                refresh = true;
                            }
                        } break;
                    }
                }
            }

            initialBinding = false;

            if (refresh) theSlider.refresh();

        });

    }
});


