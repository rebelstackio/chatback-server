/* lib/logger/index.js */
'use strict';

var os = require('os');

class Logger {

	constructor ( mode ) {
		let quiet = process.env.NODE_QUIET || false;
		if (!( quiet === false || quiet == 'false' || quiet == '0' )) {
			this.quiet = true;
		} else this.quiet = false;
		mode = mode || "development";
		this._modes = {"development":0,"testing":1,"staging":2,"production":3};
		if ( typeof this._modes[mode] == 'undefined' ) throw new Error("not a valid mode");
		else this.mode = mode;
		this._severityArr = ["DEBUG","INFO","WARN","ERROR","FATAL"];
		this._severity = {"DEBUG":0,"INFO":1,"WARN":2,"ERROR":3,"FATAL":4};
		this._spacing = {"development":2,"testing":2,"staging":null,"production":null};
	}

	_emitLogEntry ( severity, error ) {
		if (this.quiet) return false;
		//var p = os.platform(); var t = os.type(); var a = os.arch();
		if ( !this._severityArr[severity] ) throw new Error("not a valid severity");
		else {
			if ( severity===0 && this._modes[this.mode] > 1 ) return false;
			else {
				let h = os.hostname(), r = os.release(), u = os.uptime(), l = os.loadavg();
				let timestamp = new Date().toISOString();
				let message = "";
				let spacing = this._spacing[this.mode];
				switch ( true ) {
					case ( error instanceof Error ):
						message = { message:error.message, stack:error.stack };
						if ( error["metrigon:context"] ) {
							message.context = error["metrigon:context"];
						}
						break; // TODO: prepend exact type of error (constructor name)
					case ( typeof error == 'string' ):
						message = error;
						break;
					case ( typeof error == 'object' ):
						message = error;
						break;
					default: message = error.toString(); break;
				}
				let s = this._severity;
				/* NOTE: old code for parsing console
				var frmtverbose = "%s h=%s r=%s u=%s l=%s >>>>>%s %s<<<<<";
				var frmt = "%s >>>>>%s %s<<<<<";
				switch ( severity ) {
					case s.DEBUG: return console.log  ( frmt, timestamp, "DEBUG", message );
					case s.INFO:  return console.info ( frmt, timestamp, "INFO", message );
					case s.WARN:  return console.warn ( frmtverbose, timestamp, h, r, u, l, "WARN", message );
					case s.ERROR: return console.error( frmtverbose, timestamp, h, r, u, l, "ERROR", message );
					case s.FATAL: return console.error( frmtverbose, timestamp, h, r, u, l, "FATAL", message );
					default: return false;
				}
				*/
				/* NOTE: new code for json output to console */
				/* TODO: communicate with AWS metadata service to get extended info */
				let logjson;
				switch ( severity ) {
					case s.DEBUG:
						logjson = JSON.stringify({
							timestamp:timestamp, type:"DEBUG", message:message
						},null,spacing);
						return console.log  ( logjson );
					case s.INFO:
						logjson = JSON.stringify({
							timestamp:timestamp, type:"INFO", message:message
						},null, spacing);
						return console.info ( logjson );
					case s.WARN:
						logjson = JSON.stringify({
							timestamp:timestamp, type:"WARN", message:message,
							h:h, r:r, u:u, l:l
						},null,spacing);
						return console.warn ( logjson );
					case s.ERROR:
						logjson = JSON.stringify({
							timestamp:timestamp, type:"ERROR", message:message,
							h:h, r:r, u:u, l:l
						},null,spacing);
						return console.error( logjson );
					case s.FATAL:
						logjson = JSON.stringify({
							timestamp:timestamp, type:"FATAL", message:message,
							h:h, r:r, u:u, l:l
						},null,spacing);
						return console.error( logjson );
					default: return false;
				}
			}
		}
	};

	debug ( msgErr ) { return this._emitLogEntry( 0, msgErr ); }

	info ( msgErr ) { return this._emitLogEntry( 1, msgErr ); }

	warn ( msgErr ) { return this._emitLogEntry( 2, msgErr ); }

	error ( msgErr ) { return this._emitLogEntry( 3, msgErr ); }

	fatal ( msgErr ) {
		// TODO: attempt an instant notification
		return this._emitLogEntry( 4, msgErr )
	};
}

module.exports = Logger;
