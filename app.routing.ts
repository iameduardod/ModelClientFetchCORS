/* removed imports for brevity */

export function AemPageMatcher(url: UrlSegment[]): any {
  if (url.length) {
    return {
      consumed: url,
      posParams: {
        path: url[url.length - 1],
      },
    };
  }
}

const routes: Routes = [
  {
    matcher: AemPageMatcher,
    component: PageComponent,
    resolve: {
      path: AemPageDataResolver,
    },
  },
  {
    path: '',
    redirectTo: 'us/en/myapp/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forRoot(routes)],
  providers: [
    AemPageDataResolver,
    {
      provide: RouteReuseStrategy,
      useClass: AemPageRouteReuseStrategy,
    },
  ],
})
export class AppRoutingModule {}
