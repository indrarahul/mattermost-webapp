// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {bindActionCreators, Dispatch} from 'redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getCurrentChannel, getDirectTeammate} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {getProfilesInCurrentChannel, getCurrentUserId, getUser, getTotalUsersStats as getTotalUsersStatsSelector} from 'mattermost-redux/selectors/entities/users';
import {get} from 'mattermost-redux/selectors/entities/preferences';

import {getChannelIntroPluginComponents} from 'selectors/plugins';

import {getTotalUsersStats} from 'mattermost-redux/actions/users';

import {Preferences, suitePluginIds} from 'utils/constants';
import {getDisplayNameByUser} from 'utils/utils';
import {getCurrentLocale} from 'selectors/i18n';

import {GlobalState} from 'types/store';

import {GenericAction} from 'mattermost-redux/types/actions';

import ChannelIntroMessage from './channel_intro_message';

function mapStateToProps(state: GlobalState) {
    const config = getConfig(state);
    const enableUserCreation = config.EnableUserCreation === 'true';
    const isReadOnly = false;
    const team = getCurrentTeam(state);
    const channel = getCurrentChannel(state) || {};
    const teammate = getDirectTeammate(state, channel.id);
    const creator = getUser(state, channel.creator_id);
    const boardComponent = getChannelIntroPluginComponents(state).find((c) => c.pluginId === suitePluginIds.focalboard);

    const usersLimit = 10;

    const stats = getTotalUsersStatsSelector(state) || {total_users_count: 0};

    return {
        currentUserId: getCurrentUserId(state),
        channel,
        fullWidth: get(state, Preferences.CATEGORY_DISPLAY_SETTINGS, Preferences.CHANNEL_DISPLAY_MODE, Preferences.CHANNEL_DISPLAY_MODE_DEFAULT) === Preferences.CHANNEL_DISPLAY_MODE_FULL_SCREEN,
        locale: getCurrentLocale(state),
        channelProfiles: getProfilesInCurrentChannel(state),
        enableUserCreation,
        isReadOnly,
        teamIsGroupConstrained: Boolean(team.group_constrained),
        creatorName: getDisplayNameByUser(state, creator),
        teammate,
        teammateName: getDisplayNameByUser(state, teammate),
        stats,
        usersLimit,
        boardComponent,
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
            getTotalUsersStats,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelIntroMessage);
