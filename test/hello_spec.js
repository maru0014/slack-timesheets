import chai from 'chai';
import hello from '../src/hello';
const should = chai.should();

describe('hello', ()=> {

    it('should return Hello yamamoto when the value is yamamoto', () => {
        hello('yamamoto').should.equal('Hello yamamoto');
    });
});
