(() => {
    
    angular.module('tournamentApp')
        .controller('PhaseCtrl', ['$scope', 'Phase', PhaseCtrl]);
    
    function PhaseCtrl($scope, Phase) {
        
        let vm = this;
        
        vm.phases = Phase.phases;
        vm.newPhase = '';

        vm.activePhase = Phase.activePhase;
        
        vm.getPhases = () => Phase.getPhases($scope.tournamentId);
        
        vm.addPhase = () => {
            let phaseName = vm.newPhase.trim();
            if (vm.isValidNewPhaseName(phaseName)) {
                let toastConfig = {message: 'Adding phase.'};
                $scope.toast(toastConfig);
                Phase.postPhase($scope.tournamentId, phaseName)
                    .then((phaseName) => {
                        vm.newPhase = '';
                        toastConfig.success = true;
                        toastConfig.message = 'Added phase: ' + phaseName;
                    })
                    .catch(error => {
                        toastConfig.success = false;
                        toastConfig.message = 'Couldn\'t add phase';
                    })
                    .finally(() => {
                        toastConfig.hideAfter = true;
                        $scope.toast(toastConfig);
                    })
            }
        }
        
        vm.removePhase = (phase) => {
            let toastConfig = {message: 'Deleting phase: ' + phase.name};
            $scope.toast(toastConfig);
            Phase.deletePhase($scope.tournamentId, phase.id)
                .then((phaseName) => {
                    toastConfig.success = true;
                    toastConfig.message = 'Deleted phase: ' + phaseName;
                })
                .catch(error => {
                    toastConfig.success = false;
                    toastConfig.message = 'Couldn\'t delete phase: ' + phase.name;
                })
                .finally(() => {
                    toastConfig.hideAfter = true;
                    $scope.toast(toastConfig);
                })
        }
        
        vm.updateActivePhase = (phase) => {
            if (vm.activePhase.id !== phase.id) {
                Phase.updateActivePhase($scope.tournamentId, phase.id)
                    .catch(error => {
                        $scope.toast({
                            message: 'Could not change active phase to: ' + phase.name,
                            success: false,
                            hideAfter: true
                        })
                    })
            }
            
        }

        vm.editPhase = (phase) => {
            if (vm.phaseNameWasChanged(phase)) {
                let toastConfig = {
                    message: 'Editing phase.'
                }
                let oldName = phase.name;
                $scope.toast(toastConfig);
                Phase.editPhase($scope.tournamentId, phase.newName.trim(), phase.id)
                    .then((newName) => {
                        
                        toastConfig.message = `Updated phase: ${oldName} \u2192 ${newName}`;
                        toastConfig.success = true;

                        phase.newName = newName;
                        phase.name = newName;
                        phase.editing = false;                        

                    })
                    .catch(() => {
                        toastConfig.message = 'Couldn\'t update phase';
                        toastConfig.success = false;
                    })
                    .finally(() => {
                        toastConfig.hideAfter = true;
                        $scope.toast(toastConfig);
                    })
            } else {
                phase.editing = false;
            }
        }
        
        vm.phaseNameWasChanged = (phase) => {
            let formattedNewName = phase.newName.trim();
            let formattedOldName = phase.name.trim();
            return formattedNewName !== formattedOldName && formattedNewName.length > 0;
        }

        vm.isValidNewPhaseName = (phaseName) => {
            phaseName = phaseName.toLowerCase().trim();
            return phaseName.length > 0 && !vm.phases.some(phase => phase.name.toLowerCase() === phaseName);
        }

        vm.getPhases();
        
    }
    
})();