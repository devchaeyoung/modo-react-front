import { useTheme } from '../../../contexts/ThemeContext'
import { Goal } from '../../../types'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

interface GoalTabsProps {
  goals: Goal[]
  selectedGoalId: string
  onSelectGoal: (id: string) => void
  onAddGoal: () => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
}

export default function GoalTabs({
  goals,
  selectedGoalId,
  onSelectGoal,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
}: GoalTabsProps) {
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'group'>('all')
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom')
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (selectedGoalId === 'all') {
      setActiveTab('all')
    } else {
      const goal = goals.find((g) => g.id === selectedGoalId)
      if (goal) {
        setActiveTab('personal')
      }
    }
  }, [selectedGoalId, goals])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTabClick = (tab: 'all' | 'personal' | 'group') => {
    setActiveTab(tab)
    if (tab === 'all') {
      onSelectGoal('all')
    } else if (tab === 'group') {
      navigate('/groups')
    }
  }

  const handleMenuClick = (e: React.MouseEvent, goalId: string) => {
    e.stopPropagation()

    if (showMenu === goalId) {
      setShowMenu(null)
      return
    }

    // Calculate menu position
    const button = e.currentTarget as HTMLButtonElement
    const rect = button.getBoundingClientRect()
    const menuHeight = 100 // Approximate menu height
    const spaceBelow = window.innerHeight - rect.bottom

    setMenuPosition(spaceBelow < menuHeight ? 'top' : 'bottom')
    setShowMenu(goalId)
  }

  const handleEdit = (e: React.MouseEvent, goal: Goal) => {
    e.stopPropagation()
    setShowMenu(null)
    onEditGoal(goal)
  }

  const handleDelete = (e: React.MouseEvent, goalId: string) => {
    e.stopPropagation()
    setShowMenu(null)
    onDeleteGoal(goalId)
  }

  const personalGoals = goals

  if (isMobile) {
    return (
      <div className="mb-4">
        <div className={`relative rounded-full p-1 ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`}>
          <div className="relative flex">
            <div
              className={`absolute bottom-1 top-1 rounded-full transition-all duration-300 ${
                isDark ? 'bg-white' : 'bg-black'
              }`}
              style={{
                left:
                  activeTab === 'all'
                    ? '0.25rem'
                    : activeTab === 'personal'
                      ? 'calc(33.333% + 0.25rem)'
                      : 'calc(66.666% + 0.25rem)',
                width: 'calc(33.333% - 0.5rem)',
              }}
            />
            <button
              onClick={() => handleTabClick('all')}
              className={`relative z-10 flex-1 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? isDark
                    ? 'text-black'
                    : 'text-white'
                  : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
              }`}
            >
              전체보기
            </button>
            <button
              onClick={() => handleTabClick('personal')}
              className={`relative z-10 flex-1 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'personal'
                  ? isDark
                    ? 'text-black'
                    : 'text-white'
                  : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
              }`}
            >
              개인
            </button>
            <button
              onClick={() => handleTabClick('group')}
              className={`relative z-10 flex-1 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'group'
                  ? isDark
                    ? 'text-black'
                    : 'text-white'
                  : isDark
                    ? 'text-gray-400'
                    : 'text-gray-600'
              }`}
            >
              그룹
            </button>
          </div>
        </div>

        {activeTab === 'personal' && (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
            {personalGoals.map((goal) => (
              <div key={goal.id} className="relative">
                <button
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    if (target.closest('.menu-trigger')) {
                      handleMenuClick(e, goal.id)
                    } else {
                      onSelectGoal(goal.id)
                    }
                  }}
                  className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedGoalId === goal.id
                      ? isDark
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                      : isDark
                        ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i
                    className={`${goal.icon} flex h-4 w-4 items-center justify-center`}
                    style={{ color: selectedGoalId === goal.id ? goal.color : undefined }}
                  ></i>
                  {goal.title}
                  <span className="menu-trigger ml-1">
                    <i className="ri-more-fill flex h-4 w-4 items-center justify-center"></i>
                  </span>
                </button>
                {showMenu === goal.id && (
                  <div
                    ref={menuRef}
                    className={`absolute ${menuPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'} right-0 z-50 overflow-hidden rounded-lg shadow-lg ${
                      isDark ? 'bg-zinc-900' : 'bg-white'
                    }`}
                    style={{ minWidth: '120px' }}
                  >
                    <button
                      onClick={(e) => handleEdit(e, goal)}
                      className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                        isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      <i className="ri-edit-line flex h-4 w-4 items-center justify-center"></i>
                      편집
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, goal.id)}
                      className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                        isDark ? 'text-red-400 hover:bg-zinc-800' : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <i className="ri-delete-bin-line flex h-4 w-4 items-center justify-center"></i>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={onAddGoal}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <i className="ri-add-line"></i>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelectGoal('all')}
        className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selectedGoalId === 'all'
            ? isDark
              ? 'bg-white text-black'
              : 'bg-black text-white'
            : isDark
              ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        전체보기
      </button>

      {goals.map((goal) => (
        <div key={goal.id} className="relative">
          <button
            onClick={(e) => {
              const target = e.target as HTMLElement
              if (target.closest('.menu-trigger')) {
                handleMenuClick(e, goal.id)
              } else {
                onSelectGoal(goal.id)
              }
            }}
            className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedGoalId === goal.id
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark
                  ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i
              className={`${goal.icon} flex h-4 w-4 items-center justify-center`}
              style={{ color: selectedGoalId === goal.id ? goal.color : undefined }}
            ></i>
            {goal.title}
            <span className="menu-trigger ml-1">
              <i className="ri-more-fill flex h-4 w-4 items-center justify-center"></i>
            </span>
          </button>
          {showMenu === goal.id && (
            <div
              ref={menuRef}
              className={`absolute ${menuPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'} right-0 z-50 overflow-hidden rounded-lg shadow-lg ${
                isDark ? 'bg-zinc-900' : 'bg-white'
              }`}
              style={{ minWidth: '120px' }}
            >
              <button
                onClick={(e) => handleEdit(e, goal)}
                className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                  isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-100'
                }`}
              >
                <i className="ri-edit-line flex h-4 w-4 items-center justify-center"></i>
                편집
              </button>
              <button
                onClick={(e) => handleDelete(e, goal.id)}
                className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                  isDark ? 'text-red-400 hover:bg-zinc-800' : 'text-red-600 hover:bg-gray-100'
                }`}
              >
                <i className="ri-delete-bin-line flex h-4 w-4 items-center justify-center"></i>
                삭제
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => navigate('/groups')}
        className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          isDark
            ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <i className="ri-group-line flex h-4 w-4 items-center justify-center"></i>
        그룹 목표
      </button>

      <button
        onClick={onAddGoal}
        className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          isDark
            ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <i className="ri-add-line"></i>
      </button>
    </div>
  )
}
