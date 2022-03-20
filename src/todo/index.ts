import AddWhite from "./add_white.svg";
import CheckWhite from "./check_white.svg";
import MicBlack from "./mic_black.svg";
import BackWhite from "./back_white.svg";
import DeleteWhite from "./delete_white.svg";
import AddListWhite from "./add_list_white.svg";
import CheckBlack from "./check_black.svg";
import CloseBlack from "./close_black.svg";
import {
	toast,
	toaster,
	navigation,
	router,
	date,
	src,
	round,
	image,
	placeholder,
	checkbox,
	column,
	MATCH,
	screen,
	stack,
	adapters,
	size,
	set,
	observe,
	text,
	WRAP,
	row,
	background,
	padding,
	color,
	select,
	option,
	button,
	input,
	scrollable,
	margin,
	block,
	onClick,
	sub,
	onChange,
	GlobalState,
	Data,
	crossAxisAlignment,
	eq,
	not,
	ProgrammingDate,
	ProgrammingUnderscore,
	modal,
	props,
	mainAxisAlignment,
	declare,
	condition,
	and,
	result,
	onEnter,
	bind,
	shadow,
	position,
	fab,
	grow,
	defined,
	functions,
	funcs,
	feature,
	NavigationState,
	symbol,
	clip,
	ToasterState,
	or,
	add,
	gt,
	manifest,
	alt,
	id,
	EventConfig,
	ProgrammingLanguage,
	ComponentFromConfig,
	lt,
} from "polygraphic";

// THEME : https://www.materialpalette.com/blue/deep-purple

// TO POLYGRAPHIC

// const PRIMARY = "#2196F3";
// const LIGHT_PRIMARY = "#BBDEFB";
const PRIMARY = "#2278CF";
const LIGHT_PRIMARY = "#dedede";

const PRIMARY_TEXT = "#212121";
const SECONDARY_TEXT = "#757575";

type Task = Data & {
	id : string
	adapter : "task"
	title : string
	date : number
	isComplete : boolean
	list : string
}

type TodoState = GlobalState & NavigationState & ToasterState & {
	input : {
		list : string
		task : string
	}
	list : string
	tasks : Array<Task>
	task : Task
	lists : Array<Data & {
		id : string
		title : string
	}>
}

const Todo = functions(({
	global,
	_,
	Date,
	Math
} : {
	global : TodoState
	_ : ProgrammingUnderscore
	Date : ProgrammingDate
	Math : Math
}) => ({
	generateId : () => result(add(Date.now().toString(16), "_", _.slice(Math.random().toString(16), 2))) as unknown as string,
	getListSize : ({
		list
	} : {
		list : string
	}) => declare(({
		length
	}) => [
		condition(
			gt(length, 0),
			result(add(" (", _.toString(length), ")"))
		).otherwise(
			result("")
		)
	], {
		length : _.filter(global.tasks, ({
			item	
		}) => result(and(eq(item.list, list), not(item.isComplete)))).length
	}) as unknown as string,
	getList : () => condition(
		or(
			eq(global.list, "all"),
			eq(global.list, "completed"),
		),
		result("")
	).otherwise(
		result(global.list)
	) as unknown as string,
	createList : () => condition(
		not(eq(global.input.list, "")), 
		declare(({
			id
		}) => [
			set(global.list, id),
			set(global.lists, _.concat(global.lists, [{
				id,
				title : global.input.list,	
				adapter : "option"				
			}])),
			navigation.popRoute()
		], {
			id : Todo.generateId()
		})
	),
	deleteList : () => block([
		condition(
			eq(global.list, "all"), 
			set(global.tasks, _.filter(global.tasks, ({
				item
			}) => result(item.isComplete)))
		).otherwise(
			condition(
				eq(global.list, "completed"),
				block([
					set(global.tasks, _.filter(global.tasks, ({
						item
					}) => result(not(item.isComplete)))),
					set(global.list, "all")
				])
			).otherwise(
				block([
					set(global.tasks, _.filter(global.tasks, ({
						item
					}) => result(not(eq(item.list, global.list))))),
					set(global.lists, _.filter(global.lists, ({
						item
					}) => result(not(eq(item.id, global.list))))),
					set(global.list, "all")
				])
			)
		),
		navigation.popRoute()
	]),
	createTask : () => condition(not(eq(global.input.task, "")), 
		block([
			set(global.tasks, _.concat(global.tasks, [{
				id : Todo.generateId(),
				adapter : "task",
				title : global.input.task,
				date : -1,
				isComplete : false,
				list : Todo.getList()
			}])),
			set(global.input.task, "")
		])
	)
}));

const StyledButton = <Local>(props : {
	name : "primary" | "secondary"
	onClick : (event : EventConfig<TodoState, Local, null>) => ProgrammingLanguage
	text : string
	margin?: number
}) => button<TodoState, Local>(WRAP, WRAP, [
	margin({
		left : props.margin || 0
	}),
	padding(16),
	round(30),
	size(14),
	shadow(true),
	props.name === "primary" ? background("purple") : background("white"),
	onClick(props.onClick),
	text(WRAP, WRAP, [
		props.name === "primary" ? color("white") :color("black"),
		props.text,
	]),
]);

const AddListModal = modal<TodoState>(column(MATCH, MATCH, [
	padding(16),
	text(WRAP, WRAP, [
		"Create a List",
		color(PRIMARY_TEXT),
		size(24)
	]),
	input(MATCH, WRAP, [
		margin({
			top : 8
		}),
		placeholder("What would you like to name your new list?"),
		padding(8),
		observe(({
			event,
		}) => set(event.focus, true)),
		bind(({ global }) => global.input.list),
		onEnter(Todo.createList)
	]),
	stack(MATCH, 1, [
		background(PRIMARY)
	]),
	row(MATCH, WRAP, [
		margin({
			top : 8
		}),
		mainAxisAlignment("end"),
		StyledButton({
			name : "secondary",
			text : "CANCEL",
			onClick : navigation.popRoute
		}),
		StyledButton({
			name : "primary",
			text : "CREATE",
			onClick : Todo.createList,
			margin : 8
		}),
	])
]));

const TaskItem = stack<TodoState, Task>(MATCH, WRAP, [
	padding([16, 16, 0, 16]),
	button(MATCH, WRAP, [
		onClick(({
			global,
			_,
			local
		}) => block([
			set(global.task, _.assign({}, local)),
			navigation.pushRoute({
				route : "task"
			})
		])),
		row(MATCH, WRAP, [
			shadow(true),
			padding(16),
			round(4),
			background("white"),
			checkbox([
				margin({
					right : 8
				}),
				observe(({
					event,
					local
				}) => set(
					event.value,
					local.isComplete
				)),
				onChange(({
					local,
					event
				}) => set(local.isComplete, event))
			]),
			column(MATCH, WRAP, [
				text(WRAP, WRAP, [
					color(PRIMARY_TEXT),
					observe(({
						local,
						event
					}) => set(event.markdown, local.title))
				]),
				text(WRAP, WRAP, [
					color(PRIMARY),
					margin({
						top : 8
					}),
					observe(({
						local,
						event,
						moment,
						Date
					}) => condition(
						not(eq(local.date, -1)), 
						block([
							set(event.visible, true),
							set(event.text, moment(local.date).format("ddd, MMM D, YYYY")),
							condition(
								or(
									gt(local.date, Date.now()),
									moment(local.date).isSame(Date.now(), "day")
								), 
								set(event.color, PRIMARY)
							).otherwise(
								set(event.color, "red")
							)
						])
					).otherwise(
						set(event.visible, false)
					))
				]),
				text(WRAP, WRAP, [
					color(SECONDARY_TEXT),
					margin({
						top : 8
					}),
					observe(({
						event,
						local,
						_,
						global
					}) => block([
						condition(not(eq(local.list, "")), block([
							set(event.visible, true),
							set(event.text, _.find(global.lists, ({
								item
							}) => result(eq(item.id, local.list)), {
								title : "",
								id : "",
							}).title)
						])).otherwise(set(event.visible, false))
					]))
				])
			])
		])
	])
]);

const ListScreen = screen<TodoState>(column(MATCH, MATCH, [
	row(MATCH, WRAP, [
		shadow(true),
		padding(8),
		background(PRIMARY),
		crossAxisAlignment("center"),
		select(0, WRAP, [
			size(24),
			grow(true),
			id("global_list_picker"),
			bind(({ global }) => global.list),
			observe(({
				event,
				global,
				_
			}) => set(event.data, _.concat([{
				id: "all",
				title: "All lists",
				adapter: "option",				
			}], _.map(global.lists, ({
				item
			}) => result(_.assign({}, item, {
				title : add(item.title, Todo.getListSize({
					list : item.id
				}))
			}))), [{
				id: "completed",
				title: "Completed",
				adapter: "option",				
			}]))),
			color("white"),
			size(24),
			adapters({
				option : option([
					observe(({
						local,
						event
					}) => block([
						set(event.text, local.title),
						set(event.value, local.id)
					]))
				])
			}),
		]),
		button(40, 40, [
			round(20),
			margin({
				left : 8
			}),
			onClick(({
				global
			}) => block([
				set(global.input.list, ""),
				navigation.pushRoute({
					route : "add_list"
				})
			])),
			padding(8),
			image(24, 24, [
				alt("Add list"),
				src(AddListWhite)
			])
		]),
		button(40, 40, [
			round(20),
			margin({
				left : 8
			}),
			padding(8),
			image(24, 24, [
				alt("Delete list"),
				src(DeleteWhite)
			]),			
			onClick(() => navigation.pushRoute({
				route : "delete_list"
			}))
		]),
	]),
	stack(MATCH, 0, [
		grow(true),
		scrollable(MATCH, MATCH, [
			background(LIGHT_PRIMARY),
			column(MATCH, WRAP, [
				id("task_list"),
				padding({ bottom : 56 + 32 }),
				observe(({
					global,
					event,
					_,
					moment
				}) => set(event.data, _.sort(
					_.filter(global.tasks, ({
						item
					}) => condition(
						eq(global.list, "all"),
						result(not(item.isComplete))
					).otherwise(
						condition(
							eq(global.list, "completed"),
							result(item.isComplete)
						).otherwise(
							result(and(
								eq(global.list, item.list),
								not(item.isComplete)
							))
						)
					)), ({
						a,
						b
					}) => condition(
						not(eq(a.date, -1)), 
						condition(
							not(eq(b.date, -1)), 
							condition(
								moment(a.date).isSame(b.date, "day"), 
								result(_.compare(a.title, b.title))
							).otherwise(
								result(sub(a.date, b.date))
							)
						).otherwise(
							result(-1)
						)
					).otherwise(
						condition(
							eq(b.date, -1),
							result(_.compare(a.title, b.title))
						).otherwise(
							result(1)
						)
					)))),
				adapters({
					task : TaskItem
				})
			])
		]),
		fab([
			position({
				bottom : 16,
				right : 16
			}),
			background(PRIMARY),
			image(40, 40, [
				alt("Add task"),
				src(AddWhite)
			]),
			onClick(({
				global,				
			}) => block([
				set(global.task, {
					adapter : "task",
					date : -1,
					id : "",
					isComplete : false,
					list : Todo.getList(),
					title : "",
				}),
				navigation.pushRoute({
					route : "task"
				})
			]))
		])
	]),
	row(MATCH, WRAP, [
		background("white"),
		padding(8),
		input(0, WRAP, [
			color("black"),
			grow(true),
			padding(8),
			placeholder("Enter a task here..."),
			bind(({ global }) => global.input.task),
			onEnter(Todo.createTask)			
		]),
		feature({
			name : "speech.listen", 
			component : button(40, 40, [
				round(20),
				margin({
					left : 8
				}),
				observe(({
					event,
					global
				}) => set(event.visible, eq(global.input.task, ""))),
				padding(8),
				image(24, 24, [
					alt("Speak task"),
					src(MicBlack)
				]),
				onClick(({
					speech,
					global,
					_
				}) => speech.listen({
					onResult : ({
						results
					}) => set(global.tasks, _.concat(global.tasks, [{
						adapter : "task",
						date : -1,
						id : Todo.generateId(),
						isComplete : false,
						list : Todo.getList(),
						title : symbol(symbol(results, 0), 0).transcript,							
					}]))
				}))
			]),
			fallback: props([])
		}),		
		button(40, 40, [
			round(20),
			margin({
				left : 8
			}),
			observe(({
				event,
				global
			}) => set(event.visible, not(eq(global.input.task, "")))),
			padding(8),
			onClick(({
				global
			}) => set(global.input.task, "")),
			image(24, 24, [
				alt("Clear quick task"),
				src(CloseBlack)
			]),
		]),
		button(40, 40, [
			round(20),
			margin({
				left : 8
			}),
			padding(8),
			observe(({
				event,
				global
			}) => set(event.visible, not(eq(global.input.task, "")))),
			image(24, 24, [
				alt("Add quick task"),
				src(CheckBlack)
			]),
			onClick(Todo.createTask)
		])
	])
]));

const DeleteListModal = modal<TodoState>(column(MATCH, WRAP, [
	padding(16),
	text(WRAP, WRAP, [
		"Delete a List",
		color(PRIMARY_TEXT),
		size(24)
	]),
	text(WRAP, WRAP, [
		"Are you sure you like to delete this list and its tasks?",
		margin({
			top : 8
		}),
	]),
	row(MATCH, WRAP, [
		margin({
			top : 8
		}),
		mainAxisAlignment("end"),
		StyledButton({
			name : "secondary",
			text : "CANCEL",
			onClick : navigation.popRoute
		}),
		StyledButton({
			name : "primary",
			text : "DELETE",
			onClick : Todo.deleteList,
			margin : 8
		}),
	])
]));

const TaskScreen = screen<TodoState>(column(MATCH, MATCH, [
	background(LIGHT_PRIMARY),
	row(MATCH, WRAP, [
		shadow(true),
		padding(8),
		background(PRIMARY),
		crossAxisAlignment("center"),
		button(40, 40, [
			round(20),
			margin({
				right : 8
			}),
			padding(8),
			onClick(navigation.popRoute),
			image(24, 24, [
				alt("Back to task list"),
				src(BackWhite)
			])
		]),
		text(0, WRAP, [
			grow(true),
			"Task",
			color("white"),
			size(24),
		]),
		button(40, 40, [
			round(20),
			observe(({
				global,
				event,
				_
			}) => set(event.visible, defined(_.find(global.tasks, ({
				item
			}) => result(eq(item.id, global.task.id)), null)))),
			onClick(({
				global,
				_
			}) => block([
				set(global.tasks, _.filter(global.tasks, ({
					item
				}) => result(not(eq(item.id, global.task.id))))),
				navigation.popRoute()
			])),
			padding(8),
			margin({
				left : 8
			}),
			image(24, 24, [
				alt("Delete task"),
				src(DeleteWhite)
			])
		]),
		button(40, 40, [
			round(20),
			onClick(({
				global,
				_
			}) => 
				condition(
					not(eq(global.task.title, "")),
					declare(({
						id
					}) => [
						condition(
							eq(id, ""), 
							set(id, Todo.generateId())
						),
						set(global.tasks, _.upsert(global.tasks, _.assign({}, global.task, {
							id
						}))),
						navigation.popRoute()
					], {
						id : global.task.id
					})
				).otherwise(
					toast.pushToast({
						message : "You must provide a task title."
					})
				)),
			padding(8),
			margin({
				left : 8
			}),
			image(24, 24, [
				alt("Save task"),
				src(CheckWhite)
			])
		])
	]),
	column(MATCH, MATCH, [
		padding(16),
		text(WRAP, WRAP, [
			"Title",
			color(PRIMARY),
		]),
		input(MATCH, WRAP, [
			bind(({ global }) => global.task.title),
			placeholder("What is to be done?"),
			observe(({
				event
			}) => set(event.focus, true)),
			padding(8),
		]),
		stack(MATCH, 1, [
			background(PRIMARY)
		]),
		text(WRAP, WRAP, [
			margin({
				top : 16
			}),
			"Due date",
			color(PRIMARY),
		]),
		row(MATCH, WRAP, [
			crossAxisAlignment("end"),
			feature({
				name : "picker.date", 
				component : text(0, WRAP, [
					onClick(({
						picker,
						global
					}) => picker.date({
						ok : ({
							value
						}) => set(
							global.task.date,
							value
						)
					})),
					grow(true),
					padding(8),
					observe(({
						global,
						event,
						moment
					}) => condition(
						eq(global.task.date, -1), 
						set(event.text, "Date not set")
					).otherwise(
						set(event.text, moment(global.task.date).format("ddd, MMM D, YYYY"))
					))
				]),
				fallback : date(0, WRAP, [
					grow(true),
					padding(8),
					bind(({ global }) => global.task.date)
				]),		
			}),
			button(WRAP, WRAP, [
				margin({
					left : 8,
					bottom : 2
				}),
				text(WRAP, WRAP, [
					color(PRIMARY),
					size(14),
					padding(8),
					"TODAY"
				]),
				onClick(({
					global,
					Date
				}) => set(global.task.date, Date.now()))
			])
		]),
		stack(MATCH, 1, [
			background(PRIMARY)
		]),
		text(WRAP, WRAP, [
			margin({
				top : 16
			}),
			"List",
			color(PRIMARY),
		]),
		select(MATCH, WRAP, [
			color("black"),
			size(16),
			id("task_list_picker"),
			padding(8),
			bind(({ global }) => global.task.list),
			observe(({
				event,
				global,
				_
			}) => set(event.data, _.concat([{
				id: "",
				title: "None",
				adapter: "option",				
			}], global.lists))),
			adapters({
				option : option([
					observe(({
						local,
						event
					}) => block([
						set(event.text, local.title),
						set(event.value, local.id)
					]))
				])
			}),
		]),
		stack(MATCH, 1, [
			background(PRIMARY)
		]),
	])
]));

const App = stack<TodoState, TodoState>(MATCH, MATCH, [
	manifest({
		package : {
			android : "com.polygraphic",
			ios : ""
		},
		version : {
			name : "1.0",
			code : 1
		},
		background_color : PRIMARY,
		description : "An app to help you get stuff done",
		display : "standalone",
		icons : {
			src : CheckWhite,
			percent : .6
		},
		name : "Todo",
		short_name : "Todo",
		start_url : "/todo/",
		theme_color : PRIMARY
	}),
	clip(true),
	funcs(Todo),
	router({
		initial : "list",
		adapters : {
			list : ListScreen,
			task : TaskScreen,
			add_list : AddListModal,
			delete_list : DeleteListModal
		},
		onBack : () => block([])
	}),
	toaster()
]);

const now = Date.now();

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const state : TodoState = {
	list : "all",
	input : {
		list : "",
		task : ""
	},
	task : {
		id: "",
		adapter : "task",
		title : "",
		date : -1,
		isComplete : false,
		list : ""
	},
	tasks : [{
		id : "delete_this_task",
		adapter : "task",
		title : "Delete this task.",
		date : now,
		isComplete : false,
		list : ""
	}, {
		id : "rate_the_app",
		adapter : "task",
		title : "Rate the **Todo** app.",
		date : now + DAY,
		isComplete : false,
		list : "todo"
	}, {
		id : "create_a_task",
		adapter : "task",
		title : "Create a task.",
		date : now,
		isComplete : false,
		list : "todo"	
	}, {
		id : "get_todo_app",
		adapter : "task",
		title : "Get the **Todo** app.",
		date : now,
		isComplete : true,
		list : "todo"	
	}],
	lists : [{
		id : "todo",
		title : "Todo",
		adapter : "option",			
	}]
};

export default {
	App,
	state
};