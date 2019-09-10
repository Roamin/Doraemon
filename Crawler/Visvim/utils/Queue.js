class Queue {
    load ( list, limit = 5, handler ) {
        this.list = [...list]
        this.handler = handler
        this.parallelCount = 0
        this.limit = limit
        this.length = 0
        this.done = false

        this._parallel()

        return this
    }

    reload ( ...args ) {
        this.push( args )
        this._parallel()

        return this
    }

    _parallel () {
        while ( this.parallelCount < this.limit && this.list.length > 0 ) {
            this._iterator()
        }
    }

    _iterator () {
        if ( this.list.length === 0 ) {
            return
        }

        this.parallelCount++

        const item = this.list.shift()
        this.length = this.list.length + this.parallelCount

        this.handler( item, () => {
            this.parallelCount--

            if ( this.list.length === 0 && this.parallelCount === 0 ) {
                this._finish()
            } else {
                this._iterator()
            }
        } )
    }

    push ( ...args ) {
        this.list.push( ...args )

        return this
    }

    unshift ( ...args ) {
        this.list.unshift( ...args )

        return this
    }

    finish ( cb ) {
        this.done = true

        if ( typeof cb === 'function' ) {
            this._finish = cb
        }
    }
}

module.exports = Queue