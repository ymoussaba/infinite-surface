process.env.NODE_ENV = 'test'

/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import {spy} from 'sinon';
import InfiniteSurface from '../src/InfiniteSurface/InfiniteSurface';

describe('<InfiniteSurface />', () => {
    describe('state', () => {
        const wrapper = shallow(
            <InfiniteSurface onTouchTap={() => {
            }}>Label</InfiniteSurface>
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