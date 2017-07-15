process.env.NODE_ENV = 'test'

/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import {spy} from 'sinon';
import MovableCanvas from '../src/MovableCanvas/MovableCanvas';

describe('<MovableCanvas />', () => {
    describe('state', () => {
        const wrapper = shallow(
            <MovableCanvas onTouchTap={() => {
            }}>Label</MovableCanvas>
        );

        it('renders with initial state properly', () => {
            assert.strictEqual(wrapper.state('isAltOn'), false);
            assert.strictEqual(wrapper.state('mode'), 'MODE_NONE');
            assert.strictEqual(wrapper.state('isMouseDown'), false);
            assert.strictEqual(wrapper.state('x'), 0);
            assert.strictEqual(wrapper.state('y'), 0);
            assert.strictEqual(wrapper.state('zoom'), 1.1);
            assert.strictEqual(wrapper.state('backgroundImage'), '');
        });
    });
});