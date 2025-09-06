import { ChangeLog, Municipality, State, User } from '@/models'
import * as changeLogger from '@/utils/change-logger'

describe('State model', () => {
  let systemUser: User
  let logHookSpy: jest.SpyInstance

  beforeEach(async () => {
    systemUser = await User.create(
      { username: 'TestUser', passwordHash: 'pw' },
      { userId: 0 }
    )
    logHookSpy = jest
      .spyOn(changeLogger, 'logHook')
      .mockResolvedValue(undefined)
  })

  afterEach(() => {
    if (logHookSpy) logHookSpy.mockRestore()
  })

  it('should create state with valid name and call create log hook', async () => {
    const state = await State.create(
      { name: 'Nueva Esparta' },
      { userId: systemUser.id }
    )
    expect(state).toBeDefined()
    expect(state.name).toBe('Nueva Esparta')
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(State),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.STATE,
        modelId: state.id,
      })
    )
  })

  it('should fail if name is missing', async () => {
    expect.assertions(1)
    try {
      await State.create({}, { userId: systemUser.id })
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should not allow duplicate state names', async () => {
    expect.assertions(1)
    await State.create({ name: 'Falcón' }, { userId: systemUser.id })
    try {
      await State.create({ name: 'Falcón' }, { userId: systemUser.id })
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should update state name and call update log hook', async () => {
    const state = await State.create(
      { name: 'Bolívar' },
      { userId: systemUser.id }
    )
    state.name = 'Angostura'
    await state.save({ userId: systemUser.id })
    expect(state.name).toBe('Angostura')
    expect(logHookSpy).toHaveBeenCalledWith(
      'update',
      expect.any(State),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.STATE,
        modelId: state.id,
      })
    )
  })

  it('should soft-delete state and call delete log hook', async () => {
    const state = await State.create(
      { name: 'Zulia' },
      { userId: systemUser.id }
    )
    logHookSpy.mockClear()
    await state.destroy({ userId: systemUser.id })
    const found = await State.findByPk(state.id)
    expect(found).toBeNull()
    const deleted = await State.findByPk(state.id, { paranoid: false })
    expect(deleted).toBeDefined()
    expect(deleted?.deletionDate).toBeInstanceOf(Date)
    expect(logHookSpy).toHaveBeenCalledWith(
      'delete',
      expect.any(State),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.STATE,
        modelId: state.id,
      })
    )
  })
})

describe('State associations', () => {
  let systemUser: User
  let logHookSpy: jest.SpyInstance

  beforeEach(async () => {
    systemUser = await User.create(
      { username: 'TestUser', passwordHash: 'pw' },
      { userId: 0 }
    )
    logHookSpy = jest
      .spyOn(changeLogger, 'logHook')
      .mockResolvedValue(undefined)
  })

  afterEach(() => {
    if (logHookSpy) logHookSpy.mockRestore()
  })

  it('should associate municipalities to state and log the actions', async () => {
    const state = await State.create(
      { name: 'Carabobo' },
      { userId: systemUser.id }
    )
    // Create municipality via Municipality model and associate
    const municipality1 = await Municipality.create(
      { name: 'Valencia', stateId: state.id },
      { userId: systemUser.id }
    )
    state.$add(State.RELATIONS.MUNICIPALITIES, municipality1, {
      userId: systemUser.id,
    })

    // Create and associate a directly
    const municipality2 = (await state.$create(
      State.RELATIONS_SINGULAR.MUNICIPALITY,
      { name: 'Naguanagua' },
      { userId: systemUser.id }
    )) as Municipality

    expect(municipality1).toBeDefined()
    expect(municipality1.name).toBe('Valencia')
    expect(municipality1.stateId).toBe(state.id)

    expect(municipality2).toBeDefined()
    expect(municipality2.name).toBe('Naguanagua')
    expect(municipality2.stateId).toBe(state.id)

    expect(logHookSpy).toHaveBeenCalledTimes(3)
    // First call for state creation
    expect(logHookSpy).toHaveBeenNthCalledWith(
      2,
      'create',
      expect.any(Municipality),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.MUNICIPALITY,
        modelId: municipality1.id,
      })
    )
    expect(logHookSpy).toHaveBeenNthCalledWith(
      3,
      'create',
      expect.any(Municipality),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.MUNICIPALITY,
        modelId: municipality2.id,
      })
    )
  })

  it('should fetch state with its municipalities', async () => {
    const state = await State.create(
      { name: 'Lara' },
      { userId: systemUser.id }
    )
    await state.$create(
      State.RELATIONS_SINGULAR.MUNICIPALITY,
      { name: 'Barquisimeto' },
      { userId: systemUser.id }
    )
    await state.$create(
      State.RELATIONS_SINGULAR.MUNICIPALITY,
      { name: 'Cabudare' },
      { userId: systemUser.id }
    )

    const fetchedState = await State.findByPk(state.id, {
      include: [State.RELATIONS.MUNICIPALITIES],
    })
    expect(fetchedState).toBeDefined()
    expect(fetchedState?.municipalities.length).toBe(2)
    const names = fetchedState?.municipalities.map((m) => m.name)
    expect(names).toContain('Barquisimeto')
    expect(names).toContain('Cabudare')
  })
})
