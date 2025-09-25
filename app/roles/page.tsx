'use client'

import { useState } from 'react'
import { KaratSidebar } from '@/components/karat-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Card } from '@/components/ui/card'
import { Search, ChevronDown } from 'lucide-react'
import { RolePageHeader } from '@/components/vendor-analytics/role-page-header'
import { RoleFilters } from '@/components/vendor-analytics/role-filters'
import Link from 'next/link'

interface AssessmentArea {
  name: string
  description: string
  icon: string
}

interface RoleStats {
  submissionVolume: string
  aboveBarRate: string
  recommendationDistribution: {
    doNotPass: number
    requiresFurtherReview: number
    inviteToNextRound: number
    fastTrack: number
  }
}

interface Role {
  id: string
  title: string
  description: string
  seniorityLevels: string[]
  areasAssessed: AssessmentArea[]
  stats: RoleStats
  category: string
  popularityRank: number
}

const mockRoles: Role[] = [
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    description: 'Develops user-facing applications using modern JavaScript frameworks, HTML, CSS, and related technologies. Focuses on creating responsive, accessible, and performant web experiences.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 1,
    areasAssessed: [
      {
        name: 'Problem Solving & Coding',
        description: 'JavaScript/TypeScript fundamentals, algorithmic thinking, code quality and structure',
        icon: 'code'
      },
      {
        name: 'Frontend Systems & Architecture',
        description: 'Component design, state management, performance optimization, browser APIs',
        icon: 'layout'
      },
      {
        name: 'Communication & Collaboration',
        description: 'Technical explanation, problem-solving approach, working through requirements',
        icon: 'users'
      }
    ],
    stats: {
      submissionVolume: '15-20% of total submissions',
      aboveBarRate: '25-35%',
      recommendationDistribution: {
        doNotPass: 40,
        requiresFurtherReview: 25,
        inviteToNextRound: 25,
        fastTrack: 10
      }
    }
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    description: 'Builds server-side applications, APIs, and distributed systems. Works with databases, cloud services, and scalable architecture patterns.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 2,
    areasAssessed: [
      {
        name: 'Problem Solving & Coding',
        description: 'Core programming concepts, data structures, algorithms, code quality',
        icon: 'code'
      },
      {
        name: 'System Design & Architecture',
        description: 'API design, database modeling, scalability, distributed systems concepts',
        icon: 'server'
      },
      {
        name: 'Communication & Collaboration',
        description: 'Technical explanation, problem-solving approach, requirements analysis',
        icon: 'users'
      }
    ],
    stats: {
      submissionVolume: '25-30% of total submissions',
      aboveBarRate: '20-30%',
      recommendationDistribution: {
        doNotPass: 45,
        requiresFurtherReview: 25,
        inviteToNextRound: 20,
        fastTrack: 10
      }
    }
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    description: 'Designs and maintains data pipelines, ETL processes, and data infrastructure. Works with big data technologies and ensures data quality and accessibility.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 4,
    areasAssessed: [
      {
        name: 'Data Modeling & SQL',
        description: 'Database design, complex queries, data warehousing concepts, performance optimization',
        icon: 'database'
      },
      {
        name: 'ETL/Workflow Design',
        description: 'Pipeline architecture, data transformation, workflow orchestration, error handling',
        icon: 'workflow'
      },
      {
        name: 'Problem Solving',
        description: 'Analytical thinking, debugging data issues, optimization strategies',
        icon: 'search'
      }
    ],
    stats: {
      submissionVolume: '8-12% of total submissions',
      aboveBarRate: '30-40%',
      recommendationDistribution: {
        doNotPass: 35,
        requiresFurtherReview: 30,
        inviteToNextRound: 25,
        fastTrack: 10
      }
    }
  },
  {
    id: 'full-stack-engineer',
    title: 'Full Stack Engineer',
    description: 'Works across the entire technology stack, from frontend user interfaces to backend services and databases. Versatile in multiple technologies.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 3,
    areasAssessed: [
      {
        name: 'Problem Solving & Coding',
        description: 'Multi-language proficiency, algorithmic thinking, code organization',
        icon: 'code'
      },
      {
        name: 'Full Stack Architecture',
        description: 'End-to-end system design, API integration, database interaction, deployment',
        icon: 'layers'
      },
      {
        name: 'Communication & Collaboration',
        description: 'Cross-functional communication, technical trade-offs, project planning',
        icon: 'users'
      }
    ],
    stats: {
      submissionVolume: '20-25% of total submissions',
      aboveBarRate: '22-32%',
      recommendationDistribution: {
        doNotPass: 42,
        requiresFurtherReview: 26,
        inviteToNextRound: 22,
        fastTrack: 10
      }
    }
  },
  // Additional 50 roles for stress testing
  {
    id: 'react-native-engineer',
    title: 'React Native Engineer',
    description: 'Develops cross-platform mobile applications using React Native framework.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 51,
    areasAssessed: [
      { name: 'React Native Development', description: 'React Native, JavaScript, mobile APIs', icon: 'code' },
      { name: 'Cross-Platform Design', description: 'Platform-specific UI, performance optimization', icon: 'layout' },
      { name: 'Mobile Architecture', description: 'Navigation, state management, native modules', icon: 'server' }
    ],
    stats: { submissionVolume: '6-10% of total submissions', aboveBarRate: '28-38%', recommendationDistribution: { doNotPass: 38, requiresFurtherReview: 27, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'flutter-engineer',
    title: 'Flutter Engineer',
    description: 'Creates cross-platform mobile apps using Flutter and Dart programming language.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 52,
    areasAssessed: [
      { name: 'Flutter Development', description: 'Dart, Flutter widgets, state management', icon: 'code' },
      { name: 'UI/UX Implementation', description: 'Material Design, custom widgets, animations', icon: 'layout' },
      { name: 'Platform Integration', description: 'Native plugins, platform channels, deployment', icon: 'server' }
    ],
    stats: { submissionVolume: '5-9% of total submissions', aboveBarRate: '26-36%', recommendationDistribution: { doNotPass: 39, requiresFurtherReview: 26, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'golang-engineer',
    title: 'Go Engineer',
    description: 'Builds high-performance backend services and microservices using Go programming language.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 53,
    areasAssessed: [
      { name: 'Go Programming', description: 'Go syntax, concurrency, goroutines, channels', icon: 'code' },
      { name: 'Microservices Architecture', description: 'Service design, API development, gRPC', icon: 'server' },
      { name: 'Performance Optimization', description: 'Profiling, memory management, scalability', icon: 'search' }
    ],
    stats: { submissionVolume: '4-8% of total submissions', aboveBarRate: '30-40%', recommendationDistribution: { doNotPass: 36, requiresFurtherReview: 29, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'rust-engineer',
    title: 'Rust Engineer',
    description: 'Develops system-level software and performance-critical applications using Rust.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 54,
    areasAssessed: [
      { name: 'Rust Programming', description: 'Memory safety, ownership, borrowing, lifetimes', icon: 'code' },
      { name: 'Systems Programming', description: 'Low-level programming, performance optimization', icon: 'server' },
      { name: 'Concurrency & Safety', description: 'Thread safety, async programming, error handling', icon: 'search' }
    ],
    stats: { submissionVolume: '2-6% of total submissions', aboveBarRate: '35-45%', recommendationDistribution: { doNotPass: 32, requiresFurtherReview: 30, inviteToNextRound: 28, fastTrack: 10 } }
  },
  {
    id: 'python-engineer',
    title: 'Python Engineer',
    description: 'Develops applications, scripts, and services using Python for various domains.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 55,
    areasAssessed: [
      { name: 'Python Programming', description: 'Python syntax, OOP, data structures, libraries', icon: 'code' },
      { name: 'Framework Knowledge', description: 'Django, Flask, FastAPI, web development', icon: 'server' },
      { name: 'Problem Solving', description: 'Algorithmic thinking, debugging, optimization', icon: 'search' }
    ],
    stats: { submissionVolume: '15-20% of total submissions', aboveBarRate: '28-38%', recommendationDistribution: { doNotPass: 38, requiresFurtherReview: 27, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'java-engineer',
    title: 'Java Engineer',
    description: 'Builds enterprise applications and services using Java and related technologies.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 56,
    areasAssessed: [
      { name: 'Java Programming', description: 'Core Java, OOP, collections, multithreading', icon: 'code' },
      { name: 'Enterprise Development', description: 'Spring, Hibernate, microservices, REST APIs', icon: 'server' },
      { name: 'System Design', description: 'Architecture patterns, scalability, performance', icon: 'search' }
    ],
    stats: { submissionVolume: '18-25% of total submissions', aboveBarRate: '25-35%', recommendationDistribution: { doNotPass: 42, requiresFurtherReview: 25, inviteToNextRound: 23, fastTrack: 10 } }
  },
  {
    id: 'csharp-engineer',
    title: 'C# Engineer',
    description: 'Develops applications using C# and .NET framework for various platforms.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 57,
    areasAssessed: [
      { name: 'C# Programming', description: 'C# syntax, .NET framework, OOP principles', icon: 'code' },
      { name: '.NET Development', description: 'ASP.NET, Entity Framework, Web APIs', icon: 'server' },
      { name: 'Application Architecture', description: 'Design patterns, SOLID principles, testing', icon: 'search' }
    ],
    stats: { submissionVolume: '12-18% of total submissions', aboveBarRate: '26-36%', recommendationDistribution: { doNotPass: 39, requiresFurtherReview: 26, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'php-engineer',
    title: 'PHP Engineer',
    description: 'Creates web applications and services using PHP and related web technologies.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 58,
    areasAssessed: [
      { name: 'PHP Programming', description: 'PHP syntax, OOP, web development fundamentals', icon: 'code' },
      { name: 'Web Framework', description: 'Laravel, Symfony, database integration, MVC', icon: 'server' },
      { name: 'Web Technologies', description: 'HTML, CSS, JavaScript, RESTful services', icon: 'layout' }
    ],
    stats: { submissionVolume: '8-12% of total submissions', aboveBarRate: '30-40%', recommendationDistribution: { doNotPass: 36, requiresFurtherReview: 29, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'ruby-engineer',
    title: 'Ruby Engineer',
    description: 'Builds web applications and services using Ruby and Ruby on Rails framework.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 59,
    areasAssessed: [
      { name: 'Ruby Programming', description: 'Ruby syntax, metaprogramming, gems, testing', icon: 'code' },
      { name: 'Rails Development', description: 'MVC architecture, ActiveRecord, routing, views', icon: 'server' },
      { name: 'Web Development', description: 'RESTful APIs, database design, deployment', icon: 'layout' }
    ],
    stats: { submissionVolume: '6-10% of total submissions', aboveBarRate: '28-38%', recommendationDistribution: { doNotPass: 38, requiresFurtherReview: 27, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'scala-engineer',
    title: 'Scala Engineer',
    description: 'Develops functional and object-oriented applications using Scala programming language.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 60,
    areasAssessed: [
      { name: 'Scala Programming', description: 'Functional programming, pattern matching, traits', icon: 'code' },
      { name: 'Big Data Processing', description: 'Spark, Akka, distributed systems, streaming', icon: 'server' },
      { name: 'JVM Ecosystem', description: 'Java interop, performance tuning, concurrency', icon: 'search' }
    ],
    stats: { submissionVolume: '2-6% of total submissions', aboveBarRate: '32-42%', recommendationDistribution: { doNotPass: 34, requiresFurtherReview: 30, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'kotlin-engineer',
    title: 'Kotlin Engineer',
    description: 'Creates Android apps and backend services using Kotlin programming language.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 61,
    areasAssessed: [
      { name: 'Kotlin Programming', description: 'Kotlin syntax, coroutines, null safety, interop', icon: 'code' },
      { name: 'Android Development', description: 'Android SDK, Jetpack Compose, architecture components', icon: 'layout' },
      { name: 'Backend Development', description: 'Ktor, Spring Boot, microservices, APIs', icon: 'server' }
    ],
    stats: { submissionVolume: '7-11% of total submissions', aboveBarRate: '29-39%', recommendationDistribution: { doNotPass: 37, requiresFurtherReview: 28, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'swift-engineer',
    title: 'Swift Engineer',
    description: 'Develops iOS and macOS applications using Swift programming language.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 62,
    areasAssessed: [
      { name: 'Swift Programming', description: 'Swift syntax, optionals, protocols, generics', icon: 'code' },
      { name: 'iOS Development', description: 'UIKit, SwiftUI, Core Data, iOS frameworks', icon: 'layout' },
      { name: 'Apple Ecosystem', description: 'Xcode, App Store guidelines, performance optimization', icon: 'server' }
    ],
    stats: { submissionVolume: '8-12% of total submissions', aboveBarRate: '27-37%', recommendationDistribution: { doNotPass: 38, requiresFurtherReview: 27, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'vue-engineer',
    title: 'Vue.js Engineer',
    description: 'Builds interactive web applications using Vue.js framework and ecosystem.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 63,
    areasAssessed: [
      { name: 'Vue.js Development', description: 'Vue 3, Composition API, reactivity, components', icon: 'code' },
      { name: 'Frontend Ecosystem', description: 'Vuex/Pinia, Vue Router, Nuxt.js, build tools', icon: 'layout' },
      { name: 'Web Technologies', description: 'HTML, CSS, JavaScript, responsive design', icon: 'server' }
    ],
    stats: { submissionVolume: '6-10% of total submissions', aboveBarRate: '28-38%', recommendationDistribution: { doNotPass: 38, requiresFurtherReview: 27, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'angular-engineer',
    title: 'Angular Engineer',
    description: 'Develops enterprise web applications using Angular framework and TypeScript.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 64,
    areasAssessed: [
      { name: 'Angular Development', description: 'Angular framework, TypeScript, components, services', icon: 'code' },
      { name: 'Enterprise Features', description: 'RxJS, routing, forms, HTTP client, testing', icon: 'server' },
      { name: 'Application Architecture', description: 'Module design, state management, performance', icon: 'layout' }
    ],
    stats: { submissionVolume: '8-12% of total submissions', aboveBarRate: '26-36%', recommendationDistribution: { doNotPass: 39, requiresFurtherReview: 26, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'react-engineer',
    title: 'React Engineer',
    description: 'Creates modern web applications using React library and JavaScript ecosystem.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 65,
    areasAssessed: [
      { name: 'React Development', description: 'React hooks, components, JSX, virtual DOM', icon: 'code' },
      { name: 'State Management', description: 'Redux, Context API, component lifecycle', icon: 'server' },
      { name: 'Modern JavaScript', description: 'ES6+, async/await, module systems, tooling', icon: 'layout' }
    ],
    stats: { submissionVolume: '20-25% of total submissions', aboveBarRate: '25-35%', recommendationDistribution: { doNotPass: 42, requiresFurtherReview: 25, inviteToNextRound: 23, fastTrack: 10 } }
  },
  {
    id: 'nodejs-engineer',
    title: 'Node.js Engineer',
    description: 'Builds server-side applications and APIs using Node.js runtime environment.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 66,
    areasAssessed: [
      { name: 'Node.js Development', description: 'Node.js runtime, npm, modules, event loop', icon: 'code' },
      { name: 'Backend Services', description: 'Express.js, REST APIs, middleware, authentication', icon: 'server' },
      { name: 'Async Programming', description: 'Promises, async/await, callbacks, error handling', icon: 'search' }
    ],
    stats: { submissionVolume: '18-22% of total submissions', aboveBarRate: '27-37%', recommendationDistribution: { doNotPass: 38, requiresFurtherReview: 27, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'wordpress-developer',
    title: 'WordPress Developer',
    description: 'Creates and customizes WordPress websites, themes, and plugins.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 67,
    areasAssessed: [
      { name: 'WordPress Development', description: 'WordPress core, themes, plugins, customization', icon: 'code' },
      { name: 'Web Technologies', description: 'PHP, HTML, CSS, JavaScript, MySQL', icon: 'server' },
      { name: 'Content Management', description: 'Custom post types, fields, SEO, performance', icon: 'layout' }
    ],
    stats: { submissionVolume: '10-15% of total submissions', aboveBarRate: '35-45%', recommendationDistribution: { doNotPass: 32, requiresFurtherReview: 28, inviteToNextRound: 30, fastTrack: 10 } }
  },
  {
    id: 'shopify-developer',
    title: 'Shopify Developer',
    description: 'Develops e-commerce solutions using Shopify platform and Liquid templating.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 68,
    areasAssessed: [
      { name: 'Shopify Development', description: 'Liquid templates, Shopify APIs, app development', icon: 'code' },
      { name: 'E-commerce Features', description: 'Payment integration, inventory, order management', icon: 'server' },
      { name: 'Frontend Skills', description: 'HTML, CSS, JavaScript, responsive design', icon: 'layout' }
    ],
    stats: { submissionVolume: '4-8% of total submissions', aboveBarRate: '32-42%', recommendationDistribution: { doNotPass: 34, requiresFurtherReview: 30, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'salesforce-developer',
    title: 'Salesforce Developer',
    description: 'Customizes and extends Salesforce CRM using Apex, Lightning, and declarative tools.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 69,
    areasAssessed: [
      { name: 'Salesforce Platform', description: 'Apex, SOQL, Lightning Web Components, Aura', icon: 'code' },
      { name: 'CRM Customization', description: 'Custom objects, workflows, process automation', icon: 'server' },
      { name: 'Integration', description: 'REST/SOAP APIs, data migration, third-party systems', icon: 'search' }
    ],
    stats: { submissionVolume: '6-10% of total submissions', aboveBarRate: '30-40%', recommendationDistribution: { doNotPass: 36, requiresFurtherReview: 29, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'power-platform-developer',
    title: 'Power Platform Developer',
    description: 'Creates business applications using Microsoft Power Platform tools.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 70,
    areasAssessed: [
      { name: 'Power Platform', description: 'Power Apps, Power Automate, Power BI, Dataverse', icon: 'code' },
      { name: 'Business Logic', description: 'Canvas apps, model-driven apps, custom connectors', icon: 'server' },
      { name: 'Integration', description: 'Microsoft 365, Azure services, third-party APIs', icon: 'search' }
    ],
    stats: { submissionVolume: '3-7% of total submissions', aboveBarRate: '33-43%', recommendationDistribution: { doNotPass: 33, requiresFurtherReview: 31, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'data-visualization-specialist',
    title: 'Data Visualization Specialist',
    description: 'Creates compelling data visualizations and interactive dashboards.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 71,
    areasAssessed: [
      { name: 'Visualization Tools', description: 'D3.js, Tableau, Power BI, Python visualization libraries', icon: 'layout' },
      { name: 'Data Analysis', description: 'Statistical analysis, data cleaning, insight generation', icon: 'search' },
      { name: 'Design Principles', description: 'Visual design, storytelling, user experience', icon: 'users' }
    ],
    stats: { submissionVolume: '5-9% of total submissions', aboveBarRate: '32-42%', recommendationDistribution: { doNotPass: 34, requiresFurtherReview: 30, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'etl-developer',
    title: 'ETL Developer',
    description: 'Designs and implements extract, transform, load processes for data integration.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 72,
    areasAssessed: [
      { name: 'ETL Tools', description: 'SSIS, Talend, Informatica, Apache Airflow', icon: 'workflow' },
      { name: 'Data Processing', description: 'SQL, data transformation, quality validation', icon: 'database' },
      { name: 'Data Architecture', description: 'Data warehousing, pipeline design, performance tuning', icon: 'server' }
    ],
    stats: { submissionVolume: '4-8% of total submissions', aboveBarRate: '30-40%', recommendationDistribution: { doNotPass: 36, requiresFurtherReview: 29, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'big-data-engineer',
    title: 'Big Data Engineer',
    description: 'Processes and analyzes large-scale datasets using distributed computing frameworks.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 73,
    areasAssessed: [
      { name: 'Big Data Technologies', description: 'Hadoop, Spark, Kafka, distributed systems', icon: 'server' },
      { name: 'Data Processing', description: 'Stream processing, batch processing, data pipelines', icon: 'workflow' },
      { name: 'Cloud Platforms', description: 'AWS, GCP, Azure big data services', icon: 'database' }
    ],
    stats: { submissionVolume: '3-7% of total submissions', aboveBarRate: '32-42%', recommendationDistribution: { doNotPass: 34, requiresFurtherReview: 30, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'data-warehouse-developer',
    title: 'Data Warehouse Developer',
    description: 'Designs and maintains data warehouses for business intelligence and reporting.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 74,
    areasAssessed: [
      { name: 'Data Warehousing', description: 'Dimensional modeling, star schema, data marts', icon: 'database' },
      { name: 'SQL Development', description: 'Complex queries, stored procedures, performance tuning', icon: 'search' },
      { name: 'BI Tools', description: 'OLAP, reporting tools, data integration', icon: 'workflow' }
    ],
    stats: { submissionVolume: '4-8% of total submissions', aboveBarRate: '33-43%', recommendationDistribution: { doNotPass: 33, requiresFurtherReview: 31, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'tableau-developer',
    title: 'Tableau Developer',
    description: 'Creates interactive dashboards and reports using Tableau visualization platform.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 75,
    areasAssessed: [
      { name: 'Tableau Development', description: 'Dashboard design, calculated fields, parameters', icon: 'layout' },
      { name: 'Data Connections', description: 'Data sources, joins, blending, extracts', icon: 'database' },
      { name: 'Advanced Features', description: 'Level of detail expressions, table calculations', icon: 'search' }
    ],
    stats: { submissionVolume: '6-10% of total submissions', aboveBarRate: '35-45%', recommendationDistribution: { doNotPass: 32, requiresFurtherReview: 28, inviteToNextRound: 30, fastTrack: 10 } }
  },
  {
    id: 'power-bi-developer',
    title: 'Power BI Developer',
    description: 'Builds business intelligence solutions using Microsoft Power BI platform.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 76,
    areasAssessed: [
      { name: 'Power BI Development', description: 'Report design, DAX formulas, data modeling', icon: 'layout' },
      { name: 'Data Integration', description: 'Power Query, data sources, transformations', icon: 'database' },
      { name: 'Business Intelligence', description: 'KPI design, storytelling, user experience', icon: 'users' }
    ],
    stats: { submissionVolume: '8-12% of total submissions', aboveBarRate: '34-44%', recommendationDistribution: { doNotPass: 33, requiresFurtherReview: 29, inviteToNextRound: 28, fastTrack: 10 } }
  },
  {
    id: 'looker-developer',
    title: 'Looker Developer',
    description: 'Develops data models and dashboards using Looker business intelligence platform.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 77,
    areasAssessed: [
      { name: 'LookML Development', description: 'Data modeling, dimensions, measures, explores', icon: 'code' },
      { name: 'Dashboard Design', description: 'Visualization design, user experience, performance', icon: 'layout' },
      { name: 'Data Governance', description: 'Data validation, security, best practices', icon: 'users' }
    ],
    stats: { submissionVolume: '2-6% of total submissions', aboveBarRate: '36-46%', recommendationDistribution: { doNotPass: 31, requiresFurtherReview: 31, inviteToNextRound: 28, fastTrack: 10 } }
  },
  {
    id: 'snowflake-engineer',
    title: 'Snowflake Engineer',
    description: 'Implements data solutions using Snowflake cloud data platform.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 78,
    areasAssessed: [
      { name: 'Snowflake Platform', description: 'Data warehousing, virtual warehouses, data sharing', icon: 'database' },
      { name: 'SQL Development', description: 'Advanced SQL, stored procedures, user-defined functions', icon: 'search' },
      { name: 'Data Architecture', description: 'Schema design, performance optimization, security', icon: 'server' }
    ],
    stats: { submissionVolume: '3-7% of total submissions', aboveBarRate: '33-43%', recommendationDistribution: { doNotPass: 33, requiresFurtherReview: 31, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'databricks-engineer',
    title: 'Databricks Engineer',
    description: 'Develops big data and machine learning solutions using Databricks platform.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 79,
    areasAssessed: [
      { name: 'Databricks Platform', description: 'Spark, notebooks, clusters, Delta Lake', icon: 'server' },
      { name: 'Data Engineering', description: 'ETL pipelines, data processing, optimization', icon: 'workflow' },
      { name: 'Machine Learning', description: 'MLflow, model training, deployment, monitoring', icon: 'search' }
    ],
    stats: { submissionVolume: '2-6% of total submissions', aboveBarRate: '34-44%', recommendationDistribution: { doNotPass: 32, requiresFurtherReview: 30, inviteToNextRound: 28, fastTrack: 10 } }
  },
  {
    id: 'dbt-developer',
    title: 'dbt Developer',
    description: 'Creates data transformation pipelines using dbt (data build tool) framework.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Data & Analytics',
    popularityRank: 80,
    areasAssessed: [
      { name: 'dbt Development', description: 'Models, macros, tests, documentation', icon: 'code' },
      { name: 'SQL Modeling', description: 'Data transformation, dimensional modeling, optimization', icon: 'database' },
      { name: 'Data Quality', description: 'Testing, validation, monitoring, best practices', icon: 'search' }
    ],
    stats: { submissionVolume: '2-6% of total submissions', aboveBarRate: '35-45%', recommendationDistribution: { doNotPass: 32, requiresFurtherReview: 30, inviteToNextRound: 28, fastTrack: 10 } }
  },
  {
    id: 'product-operations-manager',
    title: 'Product Operations Manager',
    description: 'Streamlines product processes, tools, and cross-functional collaboration.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Product',
    popularityRank: 81,
    areasAssessed: [
      { name: 'Process Optimization', description: 'Workflow design, efficiency improvement, automation', icon: 'workflow' },
      { name: 'Cross-functional Coordination', description: 'Team alignment, communication, project management', icon: 'users' },
      { name: 'Data & Analytics', description: 'Metrics tracking, reporting, decision support', icon: 'search' }
    ],
    stats: { submissionVolume: '3-7% of total submissions', aboveBarRate: '30-40%', recommendationDistribution: { doNotPass: 36, requiresFurtherReview: 29, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'product-designer-senior',
    title: 'Senior Product Designer',
    description: 'Leads design initiatives and mentors junior designers in product development.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Design',
    popularityRank: 82,
    areasAssessed: [
      { name: 'Design Leadership', description: 'Design strategy, team mentoring, design systems', icon: 'users' },
      { name: 'Advanced Design Skills', description: 'Complex UX problems, interaction design, prototyping', icon: 'layout' },
      { name: 'Business Impact', description: 'Strategic thinking, stakeholder management, metrics', icon: 'search' }
    ],
    stats: { submissionVolume: '2-6% of total submissions', aboveBarRate: '25-35%', recommendationDistribution: { doNotPass: 42, requiresFurtherReview: 26, inviteToNextRound: 22, fastTrack: 10 } }
  },
  {
    id: 'content-designer',
    title: 'Content Designer',
    description: 'Creates user-centered content and copy for digital products and experiences.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Design',
    popularityRank: 83,
    areasAssessed: [
      { name: 'Content Strategy', description: 'Information architecture, content planning, user journeys', icon: 'search' },
      { name: 'Writing & Editing', description: 'UX writing, microcopy, tone of voice, localization', icon: 'users' },
      { name: 'Collaboration', description: 'Cross-functional work, design integration, user testing', icon: 'layout' }
    ],
    stats: { submissionVolume: '4-8% of total submissions', aboveBarRate: '32-42%', recommendationDistribution: { doNotPass: 34, requiresFurtherReview: 30, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'motion-designer',
    title: 'Motion Designer',
    description: 'Creates animations and motion graphics for digital products and marketing.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Design',
    popularityRank: 84,
    areasAssessed: [
      { name: 'Animation Skills', description: 'After Effects, motion principles, timing, easing', icon: 'layout' },
      { name: 'Design Integration', description: 'UI animation, micro-interactions, prototyping', icon: 'workflow' },
      { name: 'Creative Vision', description: 'Storytelling, visual narrative, brand consistency', icon: 'users' }
    ],
    stats: { submissionVolume: '2-6% of total submissions', aboveBarRate: '30-40%', recommendationDistribution: { doNotPass: 36, requiresFurtherReview: 29, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: '3d-designer',
    title: '3D Designer',
    description: 'Creates three-dimensional models, visualizations, and immersive experiences.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Design',
    popularityRank: 85,
    areasAssessed: [
      { name: '3D Modeling', description: 'Blender, Maya, 3ds Max, modeling techniques', icon: 'layout' },
      { name: 'Visualization', description: 'Rendering, lighting, texturing, composition', icon: 'search' },
      { name: 'Technical Skills', description: 'Optimization, file formats, pipeline integration', icon: 'code' }
    ],
    stats: { submissionVolume: '2-6% of total submissions', aboveBarRate: '28-38%', recommendationDistribution: { doNotPass: 38, requiresFurtherReview: 27, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'brand-designer',
    title: 'Brand Designer',
    description: 'Develops brand identity, guidelines, and visual communication systems.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Design',
    popularityRank: 86,
    areasAssessed: [
      { name: 'Brand Development', description: 'Logo design, brand strategy, visual identity', icon: 'layout' },
      { name: 'Design Systems', description: 'Brand guidelines, consistency, application', icon: 'workflow' },
      { name: 'Creative Strategy', description: 'Brand positioning, market research, storytelling', icon: 'users' }
    ],
    stats: { submissionVolume: '4-8% of total submissions', aboveBarRate: '30-40%', recommendationDistribution: { doNotPass: 36, requiresFurtherReview: 29, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    description: 'Creates visual designs for print and digital media, marketing materials.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Design',
    popularityRank: 87,
    areasAssessed: [
      { name: 'Visual Design', description: 'Typography, layout, color theory, composition', icon: 'layout' },
      { name: 'Design Software', description: 'Adobe Creative Suite, design tools proficiency', icon: 'code' },
      { name: 'Creative Problem Solving', description: 'Concept development, client needs, iteration', icon: 'search' }
    ],
    stats: { submissionVolume: '6-10% of total submissions', aboveBarRate: '35-45%', recommendationDistribution: { doNotPass: 32, requiresFurtherReview: 28, inviteToNextRound: 30, fastTrack: 10 } }
  },
  {
    id: 'web-designer',
    title: 'Web Designer',
    description: 'Designs websites and web interfaces with focus on user experience and aesthetics.',
    seniorityLevels: ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Design',
    popularityRank: 88,
    areasAssessed: [
      { name: 'Web Design', description: 'UI design, responsive design, web standards', icon: 'layout' },
      { name: 'User Experience', description: 'Usability, accessibility, user research', icon: 'users' },
      { name: 'Technical Skills', description: 'HTML/CSS knowledge, design tools, prototyping', icon: 'code' }
    ],
    stats: { submissionVolume: '8-12% of total submissions', aboveBarRate: '32-42%', recommendationDistribution: { doNotPass: 34, requiresFurtherReview: 30, inviteToNextRound: 26, fastTrack: 10 } }
  },
  {
    id: 'service-designer',
    title: 'Service Designer',
    description: 'Designs end-to-end service experiences across multiple touchpoints and channels.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Design',
    popularityRank: 89,
    areasAssessed: [
      { name: 'Service Design', description: 'Journey mapping, service blueprints, touchpoint design', icon: 'workflow' },
      { name: 'Systems Thinking', description: 'Holistic design, stakeholder mapping, process optimization', icon: 'search' },
      { name: 'Research & Strategy', description: 'User research, business strategy, service innovation', icon: 'users' }
    ],
    stats: { submissionVolume: '1-5% of total submissions', aboveBarRate: '28-38%', recommendationDistribution: { doNotPass: 38, requiresFurtherReview: 27, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'conversation-designer',
    title: 'Conversation Designer',
    description: 'Designs conversational interfaces for chatbots, voice assistants, and AI systems.',
    seniorityLevels: ['Mid-level (3-5 years)', 'Senior (5+ years)'],
    category: 'Design',
    popularityRank: 90,
    areasAssessed: [
      { name: 'Conversation Design', description: 'Dialog flow, personality, error handling, context', icon: 'users' },
      { name: 'AI/ML Understanding', description: 'NLP concepts, intent recognition, machine learning basics', icon: 'search' },
      { name: 'User Research', description: 'Voice user research, testing, iteration', icon: 'workflow' }
    ],
    stats: { submissionVolume: '1-4% of total submissions', aboveBarRate: '30-40%', recommendationDistribution: { doNotPass: 36, requiresFurtherReview: 29, inviteToNextRound: 25, fastTrack: 10 } }
  },
  {
    id: 'frontend-architect',
    title: 'Frontend Architect',
    description: 'Designs frontend architecture and technical strategy for large-scale applications.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 91,
    areasAssessed: [
      { name: 'Architecture Design', description: 'Scalable frontend architecture, micro-frontends, performance', icon: 'server' },
      { name: 'Technical Leadership', description: 'Team guidance, code standards, best practices', icon: 'users' },
      { name: 'Technology Strategy', description: 'Framework selection, tooling, future planning', icon: 'search' }
    ],
    stats: { submissionVolume: '1-4% of total submissions', aboveBarRate: '35-45%', recommendationDistribution: { doNotPass: 32, requiresFurtherReview: 30, inviteToNextRound: 28, fastTrack: 10 } }
  },
  {
    id: 'backend-architect',
    title: 'Backend Architect',
    description: 'Designs backend systems architecture and guides technical implementation.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 92,
    areasAssessed: [
      { name: 'System Architecture', description: 'Distributed systems, microservices, scalability patterns', icon: 'server' },
      { name: 'Technical Strategy', description: 'Technology selection, architecture decisions, trade-offs', icon: 'search' },
      { name: 'Leadership', description: 'Technical mentoring, cross-team collaboration', icon: 'users' }
    ],
    stats: { submissionVolume: '1-4% of total submissions', aboveBarRate: '38-48%', recommendationDistribution: { doNotPass: 30, requiresFurtherReview: 32, inviteToNextRound: 28, fastTrack: 10 } }
  },
  {
    id: 'principal-engineer',
    title: 'Principal Engineer',
    description: 'Provides technical leadership and drives engineering excellence across organizations.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 93,
    areasAssessed: [
      { name: 'Technical Excellence', description: 'Deep technical expertise, problem solving, innovation', icon: 'search' },
      { name: 'Leadership & Influence', description: 'Technical vision, mentoring, cross-functional impact', icon: 'users' },
      { name: 'Strategic Thinking', description: 'Long-term planning, technology roadmaps, business alignment', icon: 'server' }
    ],
    stats: { submissionVolume: '0.5-2% of total submissions', aboveBarRate: '40-50%', recommendationDistribution: { doNotPass: 28, requiresFurtherReview: 32, inviteToNextRound: 30, fastTrack: 10 } }
  },
  {
    id: 'staff-engineer',
    title: 'Staff Engineer',
    description: 'Senior individual contributor with broad technical impact and leadership responsibilities.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 94,
    areasAssessed: [
      { name: 'Technical Depth', description: 'Expert-level technical skills, complex problem solving', icon: 'code' },
      { name: 'System Impact', description: 'Large-scale system design, cross-team technical influence', icon: 'server' },
      { name: 'Technical Leadership', description: 'Mentoring, technical decision making, best practices', icon: 'users' }
    ],
    stats: { submissionVolume: '1-3% of total submissions', aboveBarRate: '38-48%', recommendationDistribution: { doNotPass: 30, requiresFurtherReview: 32, inviteToNextRound: 28, fastTrack: 10 } }
  },
  {
    id: 'engineering-manager',
    title: 'Engineering Manager',
    description: 'Manages engineering teams while maintaining technical expertise and strategic oversight.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 95,
    areasAssessed: [
      { name: 'People Management', description: 'Team leadership, performance management, career development', icon: 'users' },
      { name: 'Technical Strategy', description: 'Technical roadmap, architecture decisions, code quality', icon: 'server' },
      { name: 'Project Management', description: 'Delivery planning, stakeholder management, process improvement', icon: 'workflow' }
    ],
    stats: { submissionVolume: '2-5% of total submissions', aboveBarRate: '25-35%', recommendationDistribution: { doNotPass: 42, requiresFurtherReview: 26, inviteToNextRound: 22, fastTrack: 10 } }
  },
  {
    id: 'director-of-engineering',
    title: 'Director of Engineering',
    description: 'Leads multiple engineering teams and drives organizational technical strategy.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 96,
    areasAssessed: [
      { name: 'Organizational Leadership', description: 'Multi-team management, culture building, strategic planning', icon: 'users' },
      { name: 'Technical Vision', description: 'Technology strategy, architecture oversight, innovation', icon: 'server' },
      { name: 'Business Alignment', description: 'Cross-functional collaboration, business impact, resource planning', icon: 'search' }
    ],
    stats: { submissionVolume: '0.5-2% of total submissions', aboveBarRate: '22-32%', recommendationDistribution: { doNotPass: 45, requiresFurtherReview: 25, inviteToNextRound: 20, fastTrack: 10 } }
  },
  {
    id: 'vp-of-engineering',
    title: 'VP of Engineering',
    description: 'Executive leader responsible for engineering organization strategy and execution.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 97,
    areasAssessed: [
      { name: 'Executive Leadership', description: 'Organizational strategy, executive communication, vision setting', icon: 'users' },
      { name: 'Strategic Planning', description: 'Long-term roadmaps, resource allocation, business strategy', icon: 'search' },
      { name: 'Operational Excellence', description: 'Process optimization, quality systems, performance metrics', icon: 'server' }
    ],
    stats: { submissionVolume: '0.2-1% of total submissions', aboveBarRate: '20-30%', recommendationDistribution: { doNotPass: 48, requiresFurtherReview: 22, inviteToNextRound: 20, fastTrack: 10 } }
  },
  {
    id: 'cto',
    title: 'Chief Technology Officer',
    description: 'Senior executive responsible for technology strategy and innovation across the organization.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Engineering',
    popularityRank: 98,
    areasAssessed: [
      { name: 'Technology Strategy', description: 'Innovation leadership, technology roadmap, digital transformation', icon: 'search' },
      { name: 'Executive Leadership', description: 'C-suite collaboration, board communication, organizational vision', icon: 'users' },
      { name: 'Business Impact', description: 'Technology-business alignment, competitive advantage, growth enablement', icon: 'server' }
    ],
    stats: { submissionVolume: '0.1-0.5% of total submissions', aboveBarRate: '18-28%', recommendationDistribution: { doNotPass: 50, requiresFurtherReview: 22, inviteToNextRound: 18, fastTrack: 10 } }
  },
  {
    id: 'head-of-product',
    title: 'Head of Product',
    description: 'Senior product leader responsible for product strategy and cross-functional team leadership.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Product',
    popularityRank: 99,
    areasAssessed: [
      { name: 'Product Strategy', description: 'Vision setting, roadmap planning, market analysis', icon: 'search' },
      { name: 'Leadership', description: 'Team management, cross-functional collaboration, stakeholder management', icon: 'users' },
      { name: 'Business Impact', description: 'Revenue growth, user metrics, competitive positioning', icon: 'server' }
    ],
    stats: { submissionVolume: '0.5-2% of total submissions', aboveBarRate: '20-30%', recommendationDistribution: { doNotPass: 48, requiresFurtherReview: 22, inviteToNextRound: 20, fastTrack: 10 } }
  },
  {
    id: 'chief-product-officer',
    title: 'Chief Product Officer',
    description: 'Executive leader defining product vision and strategy across the entire organization.',
    seniorityLevels: ['Senior (5+ years)'],
    category: 'Product',
    popularityRank: 100,
    areasAssessed: [
      { name: 'Product Vision', description: 'Strategic product planning, innovation leadership, market positioning', icon: 'search' },
      { name: 'Executive Leadership', description: 'C-suite collaboration, organizational alignment, culture building', icon: 'users' },
      { name: 'Business Strategy', description: 'Growth strategy, competitive analysis, customer-centricity', icon: 'server' }
    ],
    stats: { submissionVolume: '0.1-0.5% of total submissions', aboveBarRate: '15-25%', recommendationDistribution: { doNotPass: 52, requiresFurtherReview: 23, inviteToNextRound: 15, fastTrack: 10 } }
  }
]

function RoleCard({ role }: { role: Role }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card 
      className="p-6 mb-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{role.title}</h3>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
          <p className="text-gray-600 text-sm mb-3">Remote | United States</p>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium inline-block">
              New
            </span>
            <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium inline-block">
              Senior
            </span>
            <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium inline-block">
              Generalist
            </span>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium inline-block">
              {role.category}
            </span>
          </div>
        </div>
        
        <div className="flex gap-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">10</div>
            <div className="text-sm text-gray-600">Days Live</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">43</div>
            <div className="text-sm text-gray-600">Interviews<br />Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">35</div>
            <div className="text-sm text-gray-600">Interviews<br />Conducted</div>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-0'}`}>
        <div className="pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              ASSESSMENT AREA
            </div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center">
              DURATION<br />
              (Excluding Intro)
            </div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center">
            ALLOCATION
          </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="text-gray-700 text-sm">📝 Data Structure and Algorithms</div>
            </div>
            <div className="text-center text-sm text-gray-700">30 min</div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-700 w-8 text-right">60%</span>
                <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="text-gray-700 text-sm">📝 System Design</div>
            </div>
            <div className="text-center text-sm text-gray-700">10 min</div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-700 w-8 text-right">20%</span>
                <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="text-gray-700 text-sm">📋 SWE Knowledge</div>
            </div>
            <div className="text-center text-sm text-gray-700">10 min</div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-700 w-8 text-right">20%</span>
                <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center py-3 mt-2 font-medium">
            <div className="text-sm text-gray-900">TOTAL</div>
            <div className="text-center text-sm text-gray-900">50 min</div>
            <div className="text-center text-sm text-gray-900">100%</div>
          </div>
        </div>
      </div>
    </Card>
  )
}


export default function RolesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('30days')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [selectedJobFamily, setSelectedJobFamily] = useState('All Job Families')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')

  const filteredRoles = mockRoles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLevel = selectedLevel === 'All Levels' || 
      role.seniorityLevels.some(level => level.includes(selectedLevel))
    
    const matchesJobFamily = selectedJobFamily === 'All Job Families' || role.category === selectedJobFamily
    
    const matchesLocation = selectedLocation === 'All Locations' || selectedLocation === 'Remote'
    
    return matchesSearch && matchesLevel && matchesJobFamily && matchesLocation
  })

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <div className="h-full">
          <KaratSidebar />
        </div>
        <SidebarInset className="overflow-auto">
          <main className="flex-1 py-6 px-8 md:px-12 lg:px-16">
            <RolePageHeader />
            
            <RoleFilters
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
              selectedJobFamily={selectedJobFamily}
              onJobFamilyChange={setSelectedJobFamily}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <div className="mb-6">
              <h2 className="text-sm text-gray-700 font-medium">Roles ({filteredRoles.length}):</h2>
            </div>

            <div className="space-y-4">
              {filteredRoles.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>

            {filteredRoles.length === 0 && (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
                <p className="text-gray-600">Try adjusting your search terms.</p>
              </div>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
