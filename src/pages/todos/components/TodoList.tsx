import { useState } from 'react'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { Todo, Goal } from '../../../types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TodoListProps {
  todos: Todo[]
  goals: Goal[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string) => void
  onAddSubtask: (parentId: string, goalId: string) => void
  onReorder: (reorderedTodos: Todo[]) => void
  showGoalTags?: boolean
}

interface SortableTodoItemProps {
  todo: Todo
  goal?: Goal
  subtasks: Todo[]
  isExpanded: boolean
  isEditing: boolean
  editText: string
  isTopLevel: boolean
  progress: number
  isDark: boolean
  showGoalTags: boolean
  overId: string | null
  activeId: string | null
  onToggleExpand: (id: string) => void
  onToggle: (id: string) => void
  onStartEdit: (todo: Todo) => void
  onSaveEdit: (id: string) => void
  onCancelEdit: () => void
  onEditTextChange: (text: string) => void
  onAddSubtask: (parentId: string, goalId: string) => void
  onDelete: (id: string) => void
  renderSubtasks: (subtasks: Todo[], depth: number) => React.ReactElement[]
}

function SortableTodoItem({
  todo,
  goal,
  subtasks,
  isExpanded,
  isEditing,
  editText,
  isTopLevel,
  progress,
  isDark,
  showGoalTags,
  overId,
  activeId,
  onToggleExpand,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
  onAddSubtask,
  onDelete,
  renderSubtasks,
}: SortableTodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getProgressColor = () => {
    if (progress === 100) return '#10b981'
    if (progress > 0) return '#3b82f6'
    return isDark ? '#52525b' : '#d1d5db'
  }

  const isOver = overId === todo.id
  const isActive = activeId === todo.id

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
          isDark ? 'hover:bg-zinc-900' : 'hover:bg-gray-50'
        } ${isOver && !isActive ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div
          {...attributes}
          {...listeners}
          className="flex h-6 w-6 flex-shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
        >
          <i
            className={`ri-draggable flex h-5 w-5 items-center justify-center text-lg ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}
          ></i>
        </div>

        {isTopLevel ? (
          <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
            <svg className="h-12 w-12 -rotate-90 transform">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke={isDark ? '#27272a' : '#f3f4f6'}
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke={getProgressColor()}
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-xs font-semibold ${
                  progress === 100
                    ? 'text-green-600'
                    : progress > 0
                      ? 'text-blue-600'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-gray-600'
                }`}
              >
                {progress}%
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onToggle(todo.id)}
            className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-all ${
              todo.completed
                ? 'border-green-500 bg-green-500'
                : isDark
                  ? 'border-zinc-700 hover:border-zinc-600'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {todo.completed && (
              <i className="ri-check-line flex h-4 w-4 items-center justify-center text-sm text-white"></i>
            )}
          </button>
        )}

        {subtasks.length > 0 && (
          <button
            onClick={() => onToggleExpand(todo.id)}
            className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          >
            <i
              className={`ri-arrow-right-s-line flex h-5 w-5 items-center justify-center text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
        )}

        {!subtasks.length && !isTopLevel && <div className="w-5 flex-shrink-0"></div>}

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit(todo.id)
                if (e.key === 'Escape') onCancelEdit()
              }}
              onBlur={() => onSaveEdit(todo.id)}
              autoFocus
              className={`w-full rounded border px-2 py-1 text-sm ${
                isDark
                  ? 'border-zinc-700 bg-zinc-900 text-white'
                  : 'border-gray-300 bg-white text-black'
              }`}
            />
          ) : (
            <span
              onClick={() => !isTopLevel && onStartEdit(todo)}
              className={`cursor-pointer text-sm ${
                todo.completed
                  ? isDark
                    ? 'text-gray-500 line-through'
                    : 'text-gray-400 line-through'
                  : isDark
                    ? 'text-white'
                    : 'text-black'
              }`}
            >
              {todo.title}
            </span>
          )}
        </div>

        {showGoalTags && goal && (
          <div
            className="rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
          >
            {goal.title}
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddSubtask(todo.id, todo.goalId)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
            title="하위 할일 추가"
          >
            <i
              className={`ri-add-line flex h-4 w-4 items-center justify-center text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i
              className={`ri-delete-bin-line flex h-4 w-4 items-center justify-center text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
        </div>
      </div>

      {isExpanded && subtasks.length > 0 && (
        <div className="ml-6">{renderSubtasks(subtasks, 1)}</div>
      )}
    </div>
  )
}

// 하위 할일용 Sortable 컴포넌트
interface SortableSubtaskItemProps {
  subtask: Todo
  goal?: Goal
  subSubtasks: Todo[]
  isExpanded: boolean
  isEditing: boolean
  editText: string
  depth: number
  isDark: boolean
  showGoalTags: boolean
  overId: string | null
  activeId: string | null
  onToggleExpand: (id: string) => void
  onToggle: (id: string) => void
  onStartEdit: (todo: Todo) => void
  onSaveEdit: (id: string) => void
  onCancelEdit: () => void
  onEditTextChange: (text: string) => void
  onAddSubtask: (parentId: string, goalId: string) => void
  onDelete: (id: string) => void
  renderSubtasks: (subtasks: Todo[], depth: number) => React.ReactElement[]
}

function SortableSubtaskItem({
  subtask,
  goal,
  subSubtasks,
  isExpanded,
  isEditing,
  editText,
  depth,
  isDark,
  showGoalTags,
  overId,
  activeId,
  onToggleExpand,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
  onAddSubtask,
  onDelete,
  renderSubtasks,
}: SortableSubtaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subtask.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOver = overId === subtask.id
  const isActive = activeId === subtask.id

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
          isDark ? 'hover:bg-zinc-900' : 'hover:bg-gray-50'
        } ${isOver && !isActive ? 'ring-2 ring-blue-500' : ''}`}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <div
          {...attributes}
          {...listeners}
          className="flex h-6 w-6 flex-shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
        >
          <i
            className={`ri-draggable flex h-5 w-5 items-center justify-center text-lg ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}
          ></i>
        </div>

        <button
          onClick={() => onToggle(subtask.id)}
          className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-all ${
            subtask.completed
              ? 'border-green-500 bg-green-500'
              : isDark
                ? 'border-zinc-700 hover:border-zinc-600'
                : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {subtask.completed && (
            <i className="ri-check-line flex h-4 w-4 items-center justify-center text-sm text-white"></i>
          )}
        </button>

        {subSubtasks.length > 0 && (
          <button
            onClick={() => onToggleExpand(subtask.id)}
            className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          >
            <i
              className={`ri-arrow-right-s-line flex h-5 w-5 items-center justify-center text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
        )}

        {!subSubtasks.length && <div className="w-5 flex-shrink-0"></div>}

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit(subtask.id)
                if (e.key === 'Escape') onCancelEdit()
              }}
              onBlur={() => onSaveEdit(subtask.id)}
              autoFocus
              className={`w-full rounded border px-2 py-1 text-sm ${
                isDark
                  ? 'border-zinc-700 bg-zinc-900 text-white'
                  : 'border-gray-300 bg-white text-black'
              }`}
            />
          ) : (
            <span
              onClick={() => onStartEdit(subtask)}
              className={`cursor-pointer text-sm ${
                subtask.completed
                  ? isDark
                    ? 'text-gray-500 line-through'
                    : 'text-gray-400 line-through'
                  : isDark
                    ? 'text-white'
                    : 'text-black'
              }`}
            >
              {subtask.title}
            </span>
          )}
        </div>

        {showGoalTags && goal && (
          <div
            className="rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
          >
            {goal.title}
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddSubtask(subtask.id, subtask.goalId)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
            title="하위 할일 추가"
          >
            <i
              className={`ri-add-line flex h-4 w-4 items-center justify-center text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
          <button
            onClick={() => onDelete(subtask.id)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i
              className={`ri-delete-bin-line flex h-4 w-4 items-center justify-center text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
        </div>
      </div>

      {isExpanded && subSubtasks.length > 0 && <div>{renderSubtasks(subSubtasks, depth + 1)}</div>}
    </div>
  )
}

export default function TodoList({
  todos,
  goals,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onReorder,
  showGoalTags = true,
}: TodoListProps) {
  const isDark = useThemeStore(selectIsDark)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.title)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      onUpdate(id, editText.trim())
    }
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const getSubtasks = (parentId: string): Todo[] => {
    return todos.filter((t) => t.parentId === parentId).sort((a, b) => a.order - b.order)
  }

  const calculateProgress = (todoId: string): number => {
    const subtasks = getSubtasks(todoId)
    if (subtasks.length === 0) return 0

    const completedCount = subtasks.filter((t) => t.completed).length
    return Math.round((completedCount / subtasks.length) * 100)
  }

  const getAllTodoIds = (todos: Todo[]): string[] => {
    const ids: string[] = []
    const addIds = (todoList: Todo[]) => {
      todoList.forEach((todo) => {
        ids.push(todo.id)
        const subtasks = getSubtasks(todo.id)
        if (subtasks.length > 0) {
          addIds(subtasks)
        }
      })
    }
    addIds(todos)
    return ids
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setOverId(over ? (over.id as string) : null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)
    setOverId(null)

    if (!over || active.id === over.id) {
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    const activeTodo = todos.find((t) => t.id === activeId)
    const overTodo = todos.find((t) => t.id === overId)

    if (!activeTodo || !overTodo) return

    // 자기 자신의 하위로는 이동 불가
    const isDescendant = (parentId: string, childId: string): boolean => {
      const children = todos.filter((t) => t.parentId === parentId)
      if (children.some((c) => c.id === childId)) return true
      return children.some((c) => isDescendant(c.id, childId))
    }

    if (isDescendant(activeId, overId)) {
      return
    }

    // overTodo의 하위로 이동
    const overSubtasks = todos.filter((t) => t.parentId === overId)
    const maxOrder = overSubtasks.reduce((max, t) => Math.max(max, t.order), -1)

    const updatedActiveTodo = {
      ...activeTodo,
      parentId: overId,
      order: maxOrder + 1,
    }

    const updatedTodos = todos.map((t) => (t.id === activeId ? updatedActiveTodo : t))

    onReorder(updatedTodos)

    // 자동으로 확장
    setExpandedIds((prev) => new Set([...prev, overId]))
  }

  const renderSubtasks = (subtasks: Todo[], depth: number): React.ReactElement[] => {
    const sortedSubtasks = [...subtasks].sort((a, b) => a.order - b.order)

    return sortedSubtasks.map((subtask) => {
      const goal = goals.find((g) => g.id === subtask.goalId)
      const subSubtasks = getSubtasks(subtask.id)
      const isExpanded = expandedIds.has(subtask.id)
      const isEditing = editingId === subtask.id

      return (
        <SortableSubtaskItem
          key={subtask.id}
          subtask={subtask}
          goal={goal}
          subSubtasks={subSubtasks}
          isExpanded={isExpanded}
          isEditing={isEditing}
          editText={editText}
          depth={depth}
          isDark={isDark}
          showGoalTags={showGoalTags}
          overId={overId}
          activeId={activeId}
          onToggleExpand={toggleExpand}
          onToggle={onToggle}
          onStartEdit={startEdit}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onEditTextChange={setEditText}
          onAddSubtask={onAddSubtask}
          onDelete={onDelete}
          renderSubtasks={renderSubtasks}
        />
      )
    })
  }

  const topLevelTodos = todos.filter((t) => !t.parentId).sort((a, b) => a.order - b.order)
  const allTodoIds = getAllTodoIds(topLevelTodos)

  if (topLevelTodos.length === 0) {
    return (
      <div className={`py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <i className="ri-checkbox-blank-circle-line mx-auto mb-3 flex h-10 w-10 items-center justify-center text-4xl"></i>
        <p className="text-sm">할일이 없습니다</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allTodoIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {topLevelTodos.map((todo) => {
            const goal = goals.find((g) => g.id === todo.goalId)
            const subtasks = getSubtasks(todo.id)
            const isExpanded = expandedIds.has(todo.id)
            const isEditing = editingId === todo.id
            const progress = calculateProgress(todo.id)

            return (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                goal={goal}
                subtasks={subtasks}
                isExpanded={isExpanded}
                isEditing={isEditing}
                editText={editText}
                isTopLevel={true}
                progress={progress}
                isDark={isDark}
                showGoalTags={showGoalTags}
                overId={overId}
                activeId={activeId}
                onToggleExpand={toggleExpand}
                onToggle={onToggle}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onEditTextChange={setEditText}
                onAddSubtask={onAddSubtask}
                onDelete={onDelete}
                renderSubtasks={renderSubtasks}
              />
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
}
