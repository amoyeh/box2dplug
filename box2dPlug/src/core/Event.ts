module box2dp {

    export class Event {

        //project specific events

        //when item created in the domain
        public static ITEM_CREATED: string = "item_created";
        //before domain update step
        public static BEFORE_STEP: string = "before_step";
        //after domain update step
        public static AFTER_STEP: string = "after_step";
        //before domain render
        public static BEFORE_RENDER: string = "before_render";
        //after domain render
        public static AFTER_RENDER: string = "after_render";
        //when contact occur on ItemEntity(enableContactEvent = true) or sensor
        public static BEGIN_CONTACT: string = "begin_contact";
        //when contact ends on ItemEntity(enableContactEvent = true) or sensor
        public static END_CONTACT: string = "end_contact";
        //when pre solve , post solve event occur from box2d
        public static PRESOLVE: string = "presolve";
        public static POSTSOLVE: string = "postsolve";

        public static PARTICLE_REMOVED: string = "particleRemoved";
        public static PARTICLE_CREATED: string = "particleCreated";

        public static PARTICLE_FIXTURE_CONTACT: string = "pfContact";
        public static PARTICLE_PARTICLE_CONTACT: string = "ppContact";

        public type: string;
        public target: any;
        public values: any;

        constructor(type: string, target?: any, values?: any) {
            this.type = type;
            if (target) this.target = target;
            if (values) this.values = values;
        }
        toString(): string {
            return "[event] type: " + this.type + " target: " + this.target + " values: " + this.values;
        }
    }

    export class EventDispatcher {
        private callBacks: { type: string; callbacks: any[] }[] = [];
        addEvent(type: string, func: any, caller?: any): void {
            if (this.callBacks[type] == null) {
                this.callBacks[type] = [];
            }
            this.callBacks[type].push({ func: func, caller: caller });
        }
        removeEvent(type: string, func: any) {
            if (this.callBacks[type] != null) {
                var callbackLen: number = this.callBacks[type].length;
                for (var k: number = 0; k < callbackLen; k++) {
                    if (this.callBacks[type][k].func === func) {
                        this.callBacks[type].splice(k, 1);
                        break;
                    }
                }
            }
        }
        fireEvent(event: Event) {
            if (this.callBacks[event.type] != null) {
                var callbackLen: number = this.callBacks[event.type].length;
                for (var k: number = 0; k < callbackLen; k++) {
                    this.callBacks[event.type][k].func(event, this.callBacks[event.type][k].caller);
                }
            }
        }
    }

} 