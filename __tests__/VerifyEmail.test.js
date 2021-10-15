import React from 'react';
import renderer from 'react-test-renderer';
import TestRenderer from 'react-test-renderer';
import firebase from "firebase/app";
import "firebase/firestore";

import VerifyEmail from '../app/screens/VerifyEmail';

const {act} = TestRenderer;

describe('<UserTypeScreen />', () => {
	it('Testing started', async () => expect(1).toEqual(1));
	it('Children check', async () => {
		var treetree = null;
		await act( async () => {
			treetree = renderer.create(<VerifyEmail />);			
		});

		const tree = treetree.toJSON();
		
		expect(tree.children.length).toEqual(3);
		
		expect(tree.children[0].type).toEqual('Modal');
		expect(tree.children[1].type).toEqual('View');
		expect(tree.children[2].type).toEqual('RCTScrollView');

		console.log(tree.children[2].children[0].children)
		expect(tree.children[2].children[0].children[0].children[0]).toEqual("We've sent an email to ");
		expect(tree.children[2].children[0].children[1].children[0].children[0]).toEqual('RESEND VERIFICATION EMAIL');
	});
});
