export default class ScoresheetPointsTrackerService {
  constructor(ScoresheetService, TournamentService) {
    this.ScoresheetService = ScoresheetService;
    this.TournamentService = TournamentService;
    
    this.game = this.ScoresheetService.game;
    this.pointScheme = this.TournamentService.pointScheme;
  }

  getPlayerTotalPoints(player) {
    let total = 0;
    this.pointScheme.tossupValues.forEach((tv) => {
      const numberForCurrentTV = this.getNumberOfTossupTypeForPlayer(this.game, player, tv);
      total += (numberForCurrentTV * tv.value);
    });
    return total;
  }

  getNumberOfTossupTypeForPlayer(game, player, tossupValue) {
    const cycleTotal = game.cycles.reduce((total, cycle) => {
      const numberInCycle = cycle.answers.filter(a =>
        a.playerId === player.id && a.value === tossupValue.value).length;
      return total + numberInCycle;
    }, 0);
    const numberInCurrentCycle = game.currentCycle.answers.filter(a =>
      a.playerId === player.id && a.type === tossupValue.type).length;
    return cycleTotal + numberInCurrentCycle;
  }

  getNumberOfAnswersForPlayer(player) {
    return this.game.cycles.reduce((total, current) => {
      const playerAnsweredThisCycle = current.answers.some(a => a.playerId === player.id);
      return total + (playerAnsweredThisCycle ? 1 : 0);
    }, 0);
  }

  getTeamScoreUpToCycle(game, teamId, cycleIndex) {
    let score = 0;
    for (let i = 0; i <= cycleIndex; i++) {
      const cycle = game.cycles[i];
      cycle.answers.forEach((a) => {
        if (a.teamId === teamId) {
          score += a.value;
        }
      });
      score += cycle.bonuses.filter(b => b === teamId).length * this.pointScheme.bonusPointValue;
    }
    if (cycleIndex + 1 === game.currentCycle.number) {
      game.currentCycle.answers.forEach((a) => {
        if (a.teamId === teamId) {
          score += a.value;
        }
      });
      score += game.currentCycle.bonuses.filter(b =>
        b === teamId).length * this.pointScheme.bonusPointValue;
    }
    return score || 0;
  }

  getTeamBonusPointsForCycle(teamId, cycleIndex) {
    const cycle = cycleIndex + 1 ===
      this.game.currentCycle.number ? this.game.currentCycle : this.game.cycles[cycleIndex];
    return cycle.bonuses.filter(b =>
      b === teamId).length * this.pointScheme.bonusPointValue;
  }

  getTeamThatGotTossup(cycle) {
    const index = cycle.answers.findIndex(a => a.type !== 'Neg');
    return index === -1 ? null : cycle.answers[index].teamId;
  }

  getPlayerAnswerForCycle(player, cycle) {
    return cycle.answers.find(a => a.playerId === player.id);
  }

  cycleHasCorrectAnswer(cycle) {
    return cycle.answers.some(a => a.type !== 'Neg');
  }

  teamAnsweredTossupCorrectly(teamId, cycle) {
    return cycle.answers.some(a => a.teamId === teamId && a.type !== 'Neg');
  }

  getTeamBouncebacks(game, teamId) {
    let sum = 0;
    game.cycles.forEach((cycle) => {
      if (!this.teamAnsweredTossupCorrectly(teamId, cycle) &&
        this.cycleHasCorrectAnswer(cycle)) {
        const numPartsBouncedBack = cycle.bonuses.filter(b => b === teamId).length;
        sum += (numPartsBouncedBack * this.pointScheme.bonusPointValue);
      }
    });
    if (!this.teamAnsweredTossupCorrectly(teamId, game.currentCycle)
      && this.cycleHasCorrectAnswer(game.currentCycle)) {
      const numPartsBouncedBack = game.currentCycle.bonuses.filter(b => b === teamId).length;
      sum += numPartsBouncedBack * this.pointScheme.bonusPointValue;
    }
    return sum;
  }
}

ScoresheetPointsTrackerService.$inject = ['ScoresheetService', 'TournamentService'];

