var IrcUser = function (irc_connection, nick) {
    this.irc_connection = irc_connection;
    this.nick = nick;
};

module.exports = IrcUser;

IrcUser.prototype.bindEvents = function() {
    var that = this;

    // If we havent generated an event listing yet, do so now
    if (!this.irc_events) {
        this.irc_events = {
            nick:           onNick,
            away:           onAway,
            quit:           onKick,
            whoisuser:      onWhoisUser,
            whoisoperator:  onWhoisOperator,
            whoischannels:  onWhoisChannels,
            whoismodes:     onWhoisModes,
            whoisidle:      onWhoisIdle,
            whoisregnick:   onRegNick,
            endofwhois:     onEhoisEnd,
            notice:         onNotice,
            ctcp_response:  onCtcpResponse,
            privmsg:        onPrivmsg,
            ctcp_request:   onCtcpRequest
        };
    }

    this.irc_events.forEach(function (fn, event_name, irc_events) {
        // Bind the event to `that` context, storing it with the event listing
        if (!irc_events[event_name].bound_fn) {
            irc_events[event_name].bound_fn = fn.bind(that);
        }

        this.irc_connection.on('user:' + this.nick + ':' + event_name, irc_events[event_name].bound_fn);
    });
};


IrcChannel.prototype.unbindEvents = function () {
    this.irc_events.forEach(function(fn, event_name, irc_events) {
        if (irc_events[event_name].bound_fn) {
            this.irc_connection.removeListener('user:' + this.nick + ':' + event_name, irc_events[event_name].bound_fn);
        }
    });
};

IrcUser.prototype.onNick = function (event) {
    this.irc_connection.clientEvent('nick', {
        nick: event.nick,
        ident: event.ident,
        hostname: event.hostname,
        newnick: event.newnick
    });
};

IrcUser.prototype.onAway = function (event) {
    this.irc_connection.clientEvent('away', {
        nick: event.nick,
        msg: event.msg
    });
};

IrcUser.prototype.onQuit = function (event) {
    this.irc_connection.clientEvent('quit', {
        nick: event.nick,
        ident: event.ident,
        hostname: event.hostname,
        message: event.trailing
    });
};

IrcUser.prototype.onWhoisUser = function (event) {
    this.irc_connection.clientEvent('whois', {
        nick: event.nick,
        ident: event.ident,
        host: event.host,
        msg: event.msg,
        end: false
    });
};

IrcUser.prototype.onWhoisServer = function (event) {
    this.irc_connection.clientEvent('whois', {
        nick: event.nick,
        irc_server: event.irc_server,
        end: false
    });
};

IrcUser.prototype.onWhoisOperator = function (event) {
    this.irc_connection.clientEvent('whois', {
        nick: event.nick,
        msg: event.msg,
        end: false
    });
};

IrcUser.prototype.onWhoisChannels = function (event) {
    this.irc_connection.clientEvent('whois', {
        nick: event.nick,
        chans: event.chans,
        end: false
    });
};

IrcUser.prototype.onWhoisModes = function (event) {
    this.irc_connection.clientEvent('whois', {
        nick: event.nick,
        msg: event.msg,
        end: false
    });
};

IrcUser.prototype.onWhoisUser = function (event) {
    this.irc_connection.clientEvent('whois', {
        nick: event.nick,
        idle: event.idle,
        logon: event.logon || undefined,
        end: false
    });
};

IrcUser.prototype.onWhoisRegNick = function (event) {
    this.irc_connection.clientEvent('whois', {
        nick: event.nick,
        msg: event.msg,
        end: false
    });
};

IrcUser.prototype.onWhoisEnd = function (event) {
    this.irc_connection.clientEvent('whois', {
        nick: event.nick,
        msg: event.msg,
        end: true
    });
};

IrcUser.prototype.onNotice = function (event) {
    this.irc_connection.clientEvent('notice', {
        nick: event.nick,
        ident: event.ident,
        hostname: event.hostname,
        target: event.target,
        msg: event.msg
    });
};

IrcUser.prototype.onCtcpResponse = function (event) {
    this.irc_connection.clientEvent('ctcp_response', {
        nick: event.nick,
        ident: event.ident,
        hostname: event.hostname,
        channel: event.channel,
        msg: event.msg
    });
};

IrcUser.prototype.onPrivmsg = function (event) {
    this.irc_connection.clientEvent('privmsg', {
        nick: event.nick,
        ident: event.ident,
        hostname: event.hostname,
        channel: event.channel,
        msg: event.msg
    });
};

IrcUser.prototype.onCtcpRequest = function (event) {
    this.irc_connection.clientEvent('ctcp_request', {
        nick: event.nick,
        ident: event.ident,
        hostname: event.hostname,
        target: event.target,
        type: event.type,
        msg: event.msg
    });
};