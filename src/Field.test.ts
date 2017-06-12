import chai from 'chai';
import * as a from 'chai';
import R from 'ramda';
// import { LogFile } from 'ptz-log-file';
import * as Field from './Field';
import { IField, IFieldConfig } from './IField';
import { IPosition, IPositionArgs } from './IPosition';
const should = a.should();
chai.should();

// import { IPosition } from './IPosition';
// const log = LogFile({});'
const validFieldConfig: IFieldConfig = { bombs: 9, width: 9, height: 9 };
const invalidFieldConfig: IFieldConfig = { bombs: 27, width: 5, height: 5 };
const validPos: IPositionArgs = { x: 0, y: 0 };
const invalidPos: IPositionArgs = { x: -1, y: -1 };
const initialField: IField = Field.getInitialField(validFieldConfig);
const emptyField: IField = Field.getEmptyField(validFieldConfig);

console.log(emptyField);

describe('Field', () => {
    describe('getEmptyField', () => {
        emptyField.should.be.an('array');
        it.skip('should have no bombs', () => {
            let bombs = 0;
            // console.log(emptyField);
            Field.allPositions(emptyField).map(p => p.isBomb ? bombs++ : bombs);
            bombs.should.be.equal(0);
        });
        it('should field size match fieldConfig size', () => {
            emptyField.length.should.be.equal(validFieldConfig.width);
            emptyField[0].length.should.be.equal(validFieldConfig.height);
        });
    });
    describe('getBombedField', () => {
        console.log(emptyField);
        const bombedField = Field.getBombedField(emptyField, validFieldConfig);
        console.log('after ----', emptyField);
        bombedField.should.be.an('array');
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
    it('count near bombs', () => {
        const countedField = Field.countNearBombs(initialField);
        const flattenField = R.flatten(countedField);
        const isBombeb = (pos: IPosition) => pos.isBomb;
        const bombedPos = R.find(isBombeb, flattenField);
        const nearBombebPos = (pos: IPosition) => Field.validNearPos(initialField, pos);
        nearBombebPos(bombedPos).map(p => countedField[p.x][p.y].nearBombs.should.be.above(0));
        countedField.should.be.an('array');
    });
    describe('openPosition', () => {
        it('should return a opened position', () => {
            const closedPosition: IPosition = Field.newPos(1, 1);
            const openedPosition: IPosition = Field.openPosition(closedPosition);
            // tslint:disable-next-line:no-unused-expression
            openedPosition.opened.should.be.true;
        });
    });
    describe('nearPositions', () => {
        it('should return near positions', () => {
            const nearPos = Field.nearPositions(validPos);
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
});
