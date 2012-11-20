<!--
  tranSMART - translational medicine data mart
  
  Copyright 2008-2012 Janssen Research & Development, LLC.
  
  This product includes software developed at Janssen Research & Development, LLC.
  
  This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License 
  as published by the Free Software  * Foundation, either version 3 of the License, or (at your option) any later version, along with the following terms:
  1.	You may convey a work based on this program in accordance with section 5, provided that you retain the above notices.
  2.	You may convey verbatim copies of this program code as you receive it, in any medium, provided that you retain the above notices.
  
  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS    * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
  
 
-->

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<meta name="layout" content="admin" />
		<title>Requestmap List</title>
	</head>	
	<body>
		<div class="body">
			<h1>Requestmap List</h1>
			<g:if test="${flash.message}">
			<div class="message">${flash.message}</div>
			</g:if>
			<div class="list">
				<table>
				<thead>
					<tr>
						<g:sortableColumn property="id" title="ID" />
						<g:sortableColumn property="url" title="URL Pattern" />
						<g:sortableColumn property="configAttribute" title="Roles" />
						<th>&nbsp;</th>
					</tr>
				</thead>
				<tbody>
				<g:each in="${requestmapList}" status="i" var="requestmap">
					<tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
						<td>${requestmap.id}&nbsp&nbsp&nbsp&nbsp</td>
						<td>${requestmap.url?.encodeAsHTML()}&nbsp&nbsp&nbsp&nbsp</td>
						<td>${requestmap.configAttribute}&nbsp&nbsp&nbsp&nbsp</td>
						<td class="actionButtons">
							<span class="actionButton">
							<g:link action="show" id="${requestmap.id}">Show</g:link>
							</span>
						</td>
					</tr>
					</g:each>
				</tbody>
				</table>
			</div>
	
			<div class="paginateButtons">
				<g:paginate total="${Requestmap.count()}" />
			</div>
	
		</div>
	</body>
</html>