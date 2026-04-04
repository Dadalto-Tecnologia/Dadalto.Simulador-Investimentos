import moment from 'moment'

declare global {
    interface Date {
        toISOLocalString: () => string;
    }
}

Date.prototype.toISOLocalString = function () {
    return moment(this).format()
}

export { } // to make it a module
