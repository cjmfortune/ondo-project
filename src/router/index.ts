import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import WorkView from "../views/WorkView.vue";
import TagView from "../views/TagView.vue";
import PeopleView from "../views/PeopleView.vue";
import NewsView from "../views/NewsView.vue";
import ProjectView from "../views/ProjectView.vue";
const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'About',
        component: AboutView
    },
    {
        path: '/work',
        name: 'Work',
        component: WorkView
    },
    {
        path: '/tag/:tagName',
        name: 'Tag',
        component: TagView
    },
    {
        path: '/project/:projectName',
        name: 'Project',
        component: ProjectView
    },
    {
        path: '/people',
        name: 'People',
        component: PeopleView
    },
    {
        path: '/news',
        name: 'News',
        component: NewsView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
