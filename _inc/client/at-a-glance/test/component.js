/**
 * External dependencies
 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import { DashConnections } from '../connections';
import { DashScan } from '../scan';
import { PLAN_JETPACK_BUSINESS } from 'lib/plans/constants';

describe( 'Connections', () => {
	const testProps = {
		siteConnectionStatus: true,
		isDevMode: false,
		userCanDisconnectSite: true,
		userIsMaster: true,
		isLinked: true,
		userWpComLogin: 'jetpack',
		userWpComEmail: 'jetpack',
		userWpComAvatar: 'https://example.org/avatar.png',
		username: 'jetpack',
		siteIcon: 'https://example.org/site-icon.png',
		rewindStatus: { state: 'active' },
	};

	describe( 'Initially', () => {
		const wrapper = shallow( <DashConnections { ...testProps } /> );

		it( 'renders correctly', () => {
			expect( wrapper.find( '.jp-connection-type' ) ).to.have.length( 2 );
		} );

		it( 'renders cards for site and user connection', () => {
			expect( wrapper.find( '.jp-connection-settings__info' ) ).to.have.length( 2 );
		} );
	} );

	describe( 'Site connection', () => {
		const wrapper = shallow( <DashConnections { ...testProps } /> );

		it( 'indicates if user is the connection owner', () => {
			expect( wrapper.find( '.jp-connection-settings__is-owner' ) ).to.have.length( 1 );
		} );

		it( 'displays the site icon if it exists', () => {
			expect( wrapper.find( '.jp-connection-settings__site-icon' ) ).to.have.length( 1 );
		} );

		it( 'shows a disconnection link', () => {
			expect( wrapper.find( 'Connect(ConnectButton)' ) ).to.have.length( 1 );
		} );

		it( 'if there is no site icon a Gridicon is displayed', () => {
			expect( shallow( <DashConnections { ...testProps } siteIcon="" /> ).find( 'Gridicon' ) ).to.have.length( 1 );
		} );
	} );

	describe( 'when site is in Dev Mode', () => {
		const wrapper = shallow( <DashConnections { ...testProps } siteConnectionStatus={ false } isDevMode={ true } /> );

		it( 'does not show a disconnection link', () => {
			expect( wrapper.find( 'Connect(ConnectButton)' ) ).to.have.length( 0 );
		} );
	} );

	describe( 'User connection', () => {
		const wrapper = shallow( <DashConnections { ...testProps } /> ).find( '.jp-connection-type' ).at( 1 );

		it( 'shows an avatar if user is linked', () => {
			expect( wrapper.find( 'img' ) ).to.have.length( 1 );
		} );

		it( 'does not show a disconnection link for master users', () => {
			expect( wrapper.find( 'Connect(ConnectButton)' ) ).to.have.length( 0 );
		} );
	} );

	describe( 'when user is not linked', () => {
		const wrapper = shallow( <DashConnections { ...testProps } userIsMaster={ false } isLinked={ false } /> ).find( '.jp-connection-type' ).at( 1 );

		it( 'shows a link to connect the account', () => {
			expect( wrapper.find( 'Connect(ConnectButton)' ) ).to.have.length( 1 );
		} );

		it( 'does not show an avatar', () => {
			expect( wrapper.find( 'img' ) ).to.have.length( 0 );
		} );
	} );
} );

describe( 'When security scanning is available', () => {
	const scanProps = {
		siteRawUrl: 'jetpack.com',
		rewindStatus: { state: 'active' },
		scanThreats: 0,
		sitePlan: { product_slug: PLAN_JETPACK_BUSINESS },
		isDevMode: false,
		fetchingSiteData: false,
	};

	describe( 'if Rewind requires configuration', () => {
		const wrapper = shallow( <DashScan { ...scanProps } rewindStatus={ { state: 'awaiting_credentials' } } /> );

		it( 'shows a link to configure credentials', () => {
			expect( wrapper.find( '.jp-dash-item__is-awaiting-credentials' ).find( 'a' ).props( 'href' ).href ).has.string(
				'/stats/activity/jetpack.com?rewind-redirect=/wp-admin/admin.php?page=jetpack'
			);
		} );
	} );

	describe( 'if Rewind is ready', () => {
		const wrapper = shallow( <DashScan { ...scanProps } /> );

		it( 'shows content related to Rewind', () => {
			expect( wrapper.find( '.jp-dash-item__is-active' ) ).to.have.length( 1 );
		} );
	} );

	describe( 'if Rewind is not available', () => {
		const isVaultPressActive = () => true;
		const wrapper = shallow( <DashScan
			{ ...scanProps }
			rewindStatus={ { state: 'unavailable' } }
			getOptionValue={ isVaultPressActive } /> );
		it( 'queries VaultPress data', () => {
			expect( wrapper.find( 'Connect(QueryVaultPressData)' ) ).to.have.length( 1 );
		} );
	} );
} );
