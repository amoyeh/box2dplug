module box2dp {

    export class BoxMaker {

        //world reference
        public world: box2d.b2World;
        public domain: Domain;

        constructor(world: box2d.b2World, domain: Domain) {
            this.world = world;
            this.domain = domain;
        }

        public create(info: MakeInfo): box2d.b2Body {
            if (info.createType == null) {
                console.error("createType not defined");
                return;
            }
            var useInfo = info.clone();
            var body: box2d.b2Body = this.createbody(info);
            switch (info.createType) {
                case MakeInfo.MAKE_BOX_TOP_LEFT:
                case MakeInfo.MAKE_BOX_CENTER:
                    this.createBoxDef(body, useInfo);
                    break;
                case MakeInfo.MAKE_CIRCLE:
                    this.createCircleDef(body, useInfo);
                    break;
                case MakeInfo.MAKE_POLYGON:
                    this.createPolygonDef(body, useInfo);
                    break;
                case MakeInfo.MAKE_EDGE:
                    this.createEdge(body, useInfo);
                    break;
                case MakeInfo.MAKE_COMPOUND:
                    //loop every makeInfo and create a clone of its info , set offset so the position is relative to its parent
                    for (var p: number = 0; p < useInfo.makeInfos.length; p++) {
                        switch (useInfo.makeInfos[p].createType) {
                            case MakeInfo.MAKE_BOX_TOP_LEFT:
                            case MakeInfo.MAKE_BOX_CENTER:
                                var loopClone: MakeInfo = useInfo.makeInfos[p].clone();
                                var newFixture = this.createBoxDef(body, loopClone, loopClone.x, loopClone.y);
                                if (loopClone.fixtureData) newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case MakeInfo.MAKE_CIRCLE:
                                var loopClone: MakeInfo = useInfo.makeInfos[p].clone();
                                var newFixture = this.createCircleDef(body, loopClone, loopClone.x, loopClone.y);
                                if (loopClone.fixtureData) newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case MakeInfo.MAKE_POLYGON:
                                var loopClone: MakeInfo = useInfo.makeInfos[p].clone(true);
                                var newFixture = this.createPolygonDef(body, loopClone);
                                if (loopClone.fixtureData) newFixture.fixtureData = loopClone.fixtureData;
                                break;
                            case MakeInfo.MAKE_EDGE:
                                var loopClone: MakeInfo = useInfo.makeInfos[p].clone(true);
                                var newFixtures = this.createEdge(body, loopClone);
                                if (loopClone.fixtureData) {
                                    for (var k: number = 0; k < newFixtures.length; k++) {
                                        newFixtures[k].fixtureData = loopClone.fixtureData;
                                    }
                                }
                                break;
                        }
                    }
                    break;
            }
            if (useInfo.userData) body.SetUserData(useInfo.userData);
            body.SetPositionXY(useInfo.x, useInfo.y);
            return body;
        }

        public createEdge(body: box2d.b2Body, useInfo: MakeInfo): box2d.b2Fixture[] {
            var fixtureDef: box2d.b2FixtureDef = this.createFixtureDef(useInfo);
            var edge: box2d.b2EdgeShape = new box2d.b2EdgeShape();
            //2 vertices only , create edge directly
            var fixtures: box2d.b2Fixture[] = [];
            if (useInfo.b2Vertices.length == 2) {
                edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                fixtureDef.shape = edge;
                fixtures.push(body.CreateFixture(fixtureDef));
            } else {
                if (!useInfo.loopEdge) {
                    //if not looping edges, create first edge
                    edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                    edge.m_hasVertex3 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[2]);
                    fixtureDef.shape = edge;
                    fixtures.push(body.CreateFixture(fixtureDef));
                    //create rest of edges
                    for (var p: number = 1; p < useInfo.b2Vertices.length - 1; p++) {
                        var current: box2d.b2Vec2 = useInfo.b2Vertices[p];
                        var next: box2d.b2Vec2 = useInfo.b2Vertices[p + 1];
                        edge.SetAsEdge(current, next);
                        //console.log(" -- on  " + p + " - " + (p + 1));
                        if (useInfo.b2Vertices[p - 1]) {
                            edge.m_hasVertex0 = true;
                            edge.m_vertex0.Copy(useInfo.b2Vertices[p - 1]);
                            //console.log("   weld  prev  " + (p - 1));
                        }
                        if (useInfo.b2Vertices[p + 2]) {
                            edge.m_hasVertex3 = true;
                            edge.m_vertex3.Copy(useInfo.b2Vertices[p + 2]);
                            //console.log("   weld  next  " + (p + 2));
                        }
                        fixtureDef.shape = edge;
                        fixtures.push(body.CreateFixture(fixtureDef));
                    }
                } else {
                    edge.SetAsEdge(useInfo.b2Vertices[0], useInfo.b2Vertices[1]);
                    edge.m_hasVertex0 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[useInfo.b2Vertices.length - 1]);
                    edge.m_hasVertex3 = true;
                    edge.m_vertex3.Copy(useInfo.b2Vertices[2]);
                    fixtureDef.shape = edge;
                    fixtures.push(body.CreateFixture(fixtureDef));
                    //create rest of edges
                    for (var p: number = 1; p < useInfo.b2Vertices.length; p++) {
                        var current: box2d.b2Vec2 = useInfo.b2Vertices[p];
                        var next: box2d.b2Vec2 = useInfo.b2Vertices[p + 1];
                        if (next == null) {
                            next = useInfo.b2Vertices[0];
                            //console.log(" -- on  " + p + " - " + 0);
                        } else {
                            //console.log(" -- on  " + p + " - " + (p + 1));
                        }
                        edge.SetAsEdge(current, next);
                        if (useInfo.b2Vertices[p - 1]) {
                            edge.m_hasVertex0 = true;
                            edge.m_vertex0.Copy(useInfo.b2Vertices[p - 1]);
                            //console.log("   weld  prev  " + (p - 1));
                        }
                        var weldNext = useInfo.b2Vertices[p + 2];
                        if (weldNext == null) {
                            weldNext = useInfo.b2Vertices[(p + 2) % useInfo.b2Vertices.length];
                            //console.log("   weld  next  " + (p + 2) % useInfo.b2Vertices.length);
                        } else {
                            //console.log("   weld  next  " + (p + 2));
                        }
                        edge.m_hasVertex3 = true;
                        edge.m_vertex3.Copy(weldNext);
                        fixtureDef.shape = edge;
                        fixtures.push(body.CreateFixture(fixtureDef));
                    }
                }
            }
            return fixtures;
        }

        public createBoxDef(body: box2d.b2Body, useInfo: MakeInfo, offsetX: number = 0, offsetY: number = 0): box2d.b2Fixture {
            var fixtureDef: box2d.b2FixtureDef = this.createFixtureDef(useInfo);
            var poly: box2d.b2PolygonShape = new box2d.b2PolygonShape();
            var center = new box2d.b2Vec2(offsetX, offsetY);
            if (useInfo.createType == MakeInfo.MAKE_BOX_TOP_LEFT) {
                center.x += useInfo.w * .5;
                center.y += useInfo.h * .5;
            }
            poly.SetAsBox(useInfo.w * .5, useInfo.h * .5, center);
            fixtureDef.shape = poly;
            return body.CreateFixture(fixtureDef);
        }

        public createCircleDef(body: box2d.b2Body, useInfo: MakeInfo, offsetX: number = 0, offsetY: number = 0): box2d.b2Fixture {
            var fixtureDef: box2d.b2FixtureDef = this.createFixtureDef(useInfo);
            var circle: box2d.b2CircleShape = new box2d.b2CircleShape();
            circle.m_radius = useInfo.radius;
            circle.m_p.Set(offsetX, offsetY);
            fixtureDef.shape = circle;
            return body.CreateFixture(fixtureDef);
        }

        public createPolygonDef(body: box2d.b2Body, useInfo: MakeInfo): box2d.b2Fixture {
            var fixtureDef: box2d.b2FixtureDef = this.createFixtureDef(useInfo);
            var polyv: box2d.b2PolygonShape = new box2d.b2PolygonShape();
            polyv.Set(useInfo.b2Vertices);
            fixtureDef.shape = polyv;
            return body.CreateFixture(fixtureDef);
        }

        public createFixtureDef(info: MakeInfo): box2d.b2FixtureDef {
            var fixDef: box2d.b2FixtureDef = new box2d.b2FixtureDef();
            fixDef.density = info.density;
            fixDef.friction = info.friction;
            fixDef.restitution = info.restitution;
            fixDef.isSensor = info.isSensor;
            if (info.maskBits) fixDef.filter.maskBits = info.maskBits;
            if (info.categoryBits) fixDef.filter.categoryBits = info.categoryBits;
            return fixDef;
        }

        public createbody(info: MakeInfo): box2d.b2Body {
            var bodyDef: box2d.b2BodyDef = new box2d.b2BodyDef();
            bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
            bodyDef.allowSleep = info.allowSleep;
            bodyDef.fixedRotation = info.fixedRotation;
            if (info.angle) bodyDef.angle = info.angle;
            if (info.isStatic) bodyDef.type = box2d.b2BodyType.b2_staticBody;
            if (info.bullet == true) bodyDef.bullet = true;
            var body: box2d.b2Body = this.world.CreateBody(bodyDef);
            return body;
        }

        //create the itemEntity and add to domain, fire render event
        public createItemEntity(makeInfo: MakeInfo, name: string): ItemEntity {
            var newItem = new ItemEntity(this.create(makeInfo), name);
            this.domain.items.push(newItem);
            for (var p: number = 0; p < this.domain.rlen; p++) this.domain.renderers[p].onItemCreate(newItem);
            this.domain.fireEvent(new Event(Event.ITEM_CREATED, this.domain, newItem));
            return newItem;
        }

        public createChain(baseName: string, info: MakeInfo): { segments: ItemEntity[], pins: ItemEntity[] } {

            if (!info.angle) info.angle = 0;
            if (!info.chainOverlap) info.chainOverlap = 5;
            if (info.chainPinHead == null) info.chainPinHead = false;
            if (info.chainPinTail == null) info.chainPinTail = false;
            if (info.chainCollideConnected == null) info.chainCollideConnected = false;

            //revolute join to connect entire rope sections
            var ropeRevoluteD: box2d.b2RevoluteJointDef = new box2d.b2RevoluteJointDef();
            ropeRevoluteD.collideConnected = info.chainCollideConnected;

            var previous: box2d.b2Body;
            var boxInfo = new MakeInfo({ w: info.h, h: info.w, angle: info.angle, createType: MakeInfo.MAKE_BOX_CENTER, density: info.density });
            var result: { segments: ItemEntity[], pins: ItemEntity[] } = { segments: [], pins: [] };
            var firstBody: box2d.b2Body;
            var lastBody: box2d.b2Body;

            for (var k: number = 0; k < info.chainAmt; k++) {

                var angleAddX: number = (Math.cos(info.angle) * (info.h - info.chainOverlap));
                var angleAddY: number = (Math.sin(info.angle) * (info.h - info.chainOverlap));
                boxInfo.x = info.x + angleAddX * k;
                boxInfo.y = info.y + angleAddY * k;

                var newItem = this.createItemEntity(boxInfo, baseName + ".c." + k);

                result.segments.push(newItem);

                if (k == 0) firstBody = newItem.b2body;
                if (k == info.chainAmt - 1) lastBody = newItem.b2body;

                if (previous) {
                    var anchor = newItem.b2body.GetPosition().Clone();
                    anchor.x -= (Math.cos(info.angle) * info.h) / 60; //half of the rope height plus angle offset
                    anchor.y -= (Math.sin(info.angle) * info.h) / 60; //half of the rope height plus angle offset
                    ropeRevoluteD.Initialize(previous, newItem.b2body, anchor);
                    this.world.CreateJoint(ropeRevoluteD);
                }
                previous = newItem.b2body;

            }

            //use a rope joint to ensure the length of the rope stay constant
            var ropeJointD: box2d.b2RopeJointDef = new box2d.b2RopeJointDef();
            ropeJointD.bodyA = firstBody;
            //first local anchor is the ropeTop circle, location zero 
            ropeJointD.localAnchorA = new box2d.b2Vec2(0, 0);
            //second anchor is the last part of the rope body, add half of its height
            ropeJointD.localAnchorB = new box2d.b2Vec2(0, 0);
            //maxLength = distance between ropeTop and last part of the rope, plus half of the rope body height
            ropeJointD.maxLength = MakeInfo.round((info.h - info.chainOverlap) * info.chainAmt / 30);
            //last rope part
            ropeJointD.bodyB = lastBody;
            this.world.CreateJoint(ropeJointD);

            if (info.chainPinHead) {
                //create a static item to pin on the head
                var cirInfo: MakeInfo = new MakeInfo({ x: info.x, y: info.y, radius: 4, createType: MakeInfo.MAKE_CIRCLE, isStatic: true });
                var headCircle = this.createItemEntity(cirInfo, baseName + ".head");
                ropeRevoluteD.Initialize(headCircle.b2body, firstBody, headCircle.b2body.GetPosition().Clone());
                this.world.CreateJoint(ropeRevoluteD);
            }

            if (info.chainPinTail) {
                //create a static item to pin on the head
                var lx: number = lastBody.GetPosition().x * 30;
                var ly: number = lastBody.GetPosition().y * 30;
                var cirInfo: MakeInfo = new MakeInfo({ x: lx, y: ly, radius: 4, createType: MakeInfo.MAKE_CIRCLE, isStatic: true });
                var tailCircle = this.createItemEntity(cirInfo, baseName + ".tail");
                ropeRevoluteD.Initialize(tailCircle.b2body, lastBody, tailCircle.b2body.GetPosition().Clone());
                this.world.CreateJoint(ropeRevoluteD);
            }

            return result;

        }

        public createParticle(system: box2d.b2ParticleSystem, def: box2d.b2ParticleDef, colorDef?: { color: number, alpha: number }): ItemParticle {
            //clone the definition
            var udef = new box2d.b2ParticleDef();
            udef.flags = def.flags;
            //make sure destroy event fires
            udef.flags |= box2d.b2ParticleFlag.b2_destructionListenerParticle;
            udef.lifetime = def.lifetime;
            udef.position = def.position.Clone();
            udef.velocity = def.velocity.Clone();
            var ip: ItemParticle = new box2dp.ItemParticle();
            udef["userData"] = ip;
            if (colorDef) {
                ip.uniqueColor = colorDef.color;
                ip.uniqueAlpha = colorDef.alpha;
            }
            var atIndex: number = system.CreateParticle(udef);
            ip.init(system, null, atIndex);
            this.domain.particles[system.name].push(ip);
            this.domain.fireEvent(new Event(Event.PARTICLE_CREATED, this, { itemParticle: ip }));
            for (var k: number = 0; k < this.domain.rlen; k++) this.domain.renderers[k].onParticleCreate(ip);
            return ip;
        }

        public fillParticles(system: box2d.b2ParticleSystem, def: box2d.b2ParticleDef, w: number, h: number): ItemParticle[] {
            var result: ItemParticle[] = [];
            var sx: number = def.position.x;
            var sy: number = def.position.y;
            var r: number = system.GetRadius() * 2;
            for (var lx: number = 0; lx < w; lx++) {
                for (var ly: number = 0; ly < h; ly++) {
                    var atx: number = sx + (r * lx);
                    var aty: number = sy + (r * ly);
                    var udef = new box2d.b2ParticleDef();
                    udef.flags = def.flags;
                    udef.flags |= box2d.b2ParticleFlag.b2_destructionListenerParticle;
                    udef.lifetime = def.lifetime;
                    udef.position = new box2d.b2Vec2(atx, aty);
                    udef.velocity = def.velocity.Clone();
                    var ip: ItemParticle = new box2dp.ItemParticle();
                    udef["userData"] = ip;
                    var atIndex: number = system.CreateParticle(udef);
                    ip.init(system, null, atIndex);
                    this.domain.particles[system.name].push(ip);
                    this.domain.fireEvent(new Event(Event.PARTICLE_CREATED, this, { itemParticle: ip }));
                    for (var k: number = 0; k < this.domain.rlen; k++) this.domain.renderers[k].onParticleCreate(ip);
                    result.push(ip);
                }
            }
            return result;
        }

        public createParticleGroup(system: box2d.b2ParticleSystem, def: box2d.b2ParticleGroupDef, beforeCreationCall?: Function): box2d.b2ParticleGroup {
          
            //make sure destroy event fires
            def.flags |= box2d.b2ParticleFlag.b2_destructionListenerParticle;
            var group: box2d.b2ParticleGroup = system.CreateParticleGroup(def);

            var posInfo: box2d.b2Vec2[] = system.GetPositionBuffer();
            var userInfo: ItemParticle[] = system.GetUserDataBuffer();

            var i: number = group.GetBufferIndex();
            var total: number = i + group.GetParticleCount();
            for (; i < total; i++) {
                var ip: ItemParticle = new box2dp.ItemParticle();
                if (beforeCreationCall) beforeCreationCall(ip);
                userInfo[i] = ip;
                ip.init(system, group, i);
                this.domain.particles[system.name].push(ip);
                this.domain.fireEvent(new Event(Event.PARTICLE_CREATED, this, { itemParticle: ip }));
                for (var k: number = 0; k < this.domain.rlen; k++) this.domain.renderers[k].onParticleCreate(ip);
            }
            this.domain.particleGroups.push(group);
            return group;

        }

    }

}

