import chai from 'chai';
import * as c from 'chai';
import R from 'ramda';
import * as Field from './Field';
import { IField, IFieldConfig } from './IField';
// import { log } from './index';
import { IPosition, IPositionArgs } from './IPosition';

const should = c.should();
chai.should();

const shouldBeImuttable = (a, b) => a.should.not.be.equal(b);

before('set test args', () => {
    const validFieldConfig: IFieldConfig = { bombs: 9, width: 9, height: 9 };
    const invalidFieldConfig: IFieldConfig = { bombs: 27, width: 5, height: 5 };
    const validPos: IPositionArgs = { x: 0, y: 0 };
    const invalidPos: IPositionArgs = { x: -1, y: -1 };
    const initialField: IField = Field.getInitialField(validFieldConfig);
    const emptyField: IField = Field.getEmptyField(validFieldConfig);

    describe('Field', () => {
        describe('getEmptyField', () => {
            emptyField.should.be.an('array');
            it('should have no bombs', () => {
                let bombs = 0;
                Field.allPositions(emptyField).map(p => p.isBomb ? bombs++ : bombs);
                bombs.should.be.equal(0);
            });
            it('should field size match fieldConfig size', () => {
                emptyField.length.should.be.equal(validFieldConfig.width);
                emptyField[0].length.should.be.equal(validFieldConfig.height);
            });
        });
        describe('getBombedField', () => {
            const bombedField = Field.getBombedField(emptyField, validFieldConfig);
            it('should be immutable', () => {
                bombedField.should.be.an('array');
                shouldBeImuttable(bombedField, emptyField);
            });

            it('should match bombs in the field with fieldConfig bombs', () => {
                let bombs = 0;
                Field.allPositions(bombedField).map(p => p.isBomb ? bombs++ : bombs);
                bombs.should.be.equal(validFieldConfig.bombs);
            });

            it('should throw an error if bombs number is bigger than fild size', () => {
                try {
                    const invalidField = Field.getInitialField(invalidFieldConfig);
                    should.not.exist(invalidField);
                } catch (e) {
                    e.should.be.an('error');
                }
            });
        });

        describe('countNearBombs', () => {
            const countedField = Field.countNearBombs(initialField);
            const flattenField = R.flatten(countedField);

            it('should be immutable', () => {
                shouldBeImuttable(countedField, initialField);
            });

            it('should increase near bombs', () => {
                const isBombeb = (pos: IPosition) => pos.isBomb;
                const bombedPos = R.find(isBombeb, flattenField);

                const nearBombebPos = (pos: IPosition) => Field.validNearPos(initialField, pos);
                nearBombebPos(bombedPos).map(p =>
                    countedField[p.x][p.y].nearBombs.should.be.above(0));
                countedField.should.be.an('array');
            });
        });

        describe('openPosition', () => {
            it('should be immutable', () => {
                const closedPosition: IPosition = Field.newPos(1, 1);
                const clickedPosition: IPosition = Field.openPosition(closedPosition);

                shouldBeImuttable(closedPosition, clickedPosition);
            });

            it('should return a opened position if not marked', () => {
                const closedPosition: IPosition = Field.newPos(1, 1);
                const clickedPosition: IPosition = Field.openPosition(closedPosition);

                // tslint:disable-next-line:no-unused-expression
                clickedPosition.opened.should.be.true;
            });

            it('should return a not opened position if marked', () => {
                const closedPosition: IPosition = Field.newPos(1, 1);
                const markedPosition: IPosition = Field.markPosition(closedPosition);

                const clickedPosition: IPosition = Field.openPosition(markedPosition);

                // tslint:disable-next-line:no-unused-expression
                clickedPosition.opened.should.be.not.true;
            });
        });

        describe('nearPositions', () => {
            it('should return near positions', () => {
                const nearPos = Field.nearPositions(validPos);
                nearPos.length.should.be.equal(8);
                nearPos.should.be.an('array');
            });
        });

        describe('positionIsValid', () => {
            it('should return true if position is valid', () => {
                const isValid = Field.positionIsValid(initialField, validPos);
                // tslint:disable-next-line:no-unused-expression
                isValid.should.be.true;
            });

            it('should return false if position is invalid', () => {
                const isValid = Field.positionIsValid(initialField, invalidPos);
                // tslint:disable-next-line:no-unused-expression
                isValid.should.be.false;
            });
        });

        describe('validNearPositions', () => {
            it('should return only valid near positions', () => {
                const nearPos = Field.validNearPos(initialField, validPos);
                const validateFn = (np) => np.map(Field.positionIsValid(initialField));
                const validatedpos = validateFn(nearPos);
                validatedpos.map(p => p.should.be.true);
                nearPos.should.be.an('array');
            });
        });

        describe('markPosition', () => {
            const closedPosition: IPosition = Field.newPos(1, 1);
            const marked1Position: IPosition = Field.markPosition(closedPosition);

            it('should be immutable', () => {
                shouldBeImuttable(closedPosition, marked1Position);
            });

            it('should return a marked as 1 position', () => {
                marked1Position.marked.should.be.equal(1);
            });

            const marked2Position: IPosition = Field.markPosition(marked1Position);
            it('should return a marked as 2 position', () => {
                marked2Position.marked.should.be.equal(2);
            });

            const marked3Position: IPosition = Field.markPosition(marked2Position);
            it('should return a unmarked position', () => {
                marked3Position.marked.should.be.equal(0);
            });
        });
        describe('getRandomPos', () => {
            it('should return a valid position', () => {
                const randomPos = Field.getRandomPos(initialField, validFieldConfig);
                // tslint:disable-next-line:no-unused-expression
                Field.positionIsValid(initialField, randomPos).should.be.true;
            });
        });
    });
});
