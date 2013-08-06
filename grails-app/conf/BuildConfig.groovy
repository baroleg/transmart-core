/*************************************************************************
 * tranSMART - translational medicine data mart
 * 
 * Copyright 2008-2012 Janssen Research & Development, LLC.
 * 
 * This product includes software developed at Janssen Research & Development, LLC.
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License 
 * as published by the Free Software  * Foundation, either version 3 of the License, or (at your option) any later version, along with the following terms:
 * 1.	You may convey a work based on this program in accordance with section 5, provided that you retain the above notices.
 * 2.	You may convey verbatim copies of this program code as you receive it, in any medium, provided that you retain the above notices.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS    * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with this program.  If not, see http://www.gnu.org/licenses/.
 * 
 *
 ******************************************************************/
  

grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"


grails.project.war.file = "target/${appName}.war"
grails.project.dependency.resolution = {
    // inherit Grails' default dependencies
    inherits("global") {
        // uncomment to disable ehcache
        // excludes 'ehcache'
    }
    log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
    repositories {
        grailsPlugins()
        grailsHome()
        grailsCentral()

        mavenLocal()
        mavenCentral()
        mavenRepo([
                name: 'repo.theyve.nl-public',
                root: 'http://repo.thehyve.nl/content/repositories/public/',
        ])
    }
    dependencies {
		runtime 'postgresql:postgresql:9.0-801.jdbc4'
		compile 'antlr:antlr:2.7.7'
        compile 'net.sf.opencsv:opencsv:2.3'
        compile 'org.transmartproject:transmart-core-api:1.0-SNAPSHOT'

		/* we need at least servlet-api 2.4 because of HttpServletResponse::setCharacterEncoding */
		compile 'javax.servlet:servlet-api:2.5'

        /* for GeneGo web services: */
        compile 'axis:axis:1.4'

        /* for SAML authentication
         * see example config at https://github.com/thehyve/transmartApp/commit/bf15bb51a#all_commit_comments */
        compile('org.springframework.security.extensions:spring-security-saml2-core:1.0.0.RC3-f0fb87a') {
            //excludes of spring securirty necessary because they are for a more recent version (3.1 branch)
            excludes 'spring-security-config', 'spring-security-core', 'spring-security-web'
		}

        /* update when grails spring-security-core uses a more recent version of spring-security */
        runtime 'org.springframework.security:spring-security-config:3.0.7.RELEASE'
    }

    plugins {
        compile ":hibernate:$grailsVersion"
        build ':release:2.2.1', ':rest-client-builder:1.0.3', {
            export = false
        }
        compile ":quartz:1.0-RC2"
        compile ":rdc-rmodules:0.3-SNAPSHOT"
        compile ":spring-security-core:1.2.7.3"
        compile ":resources:1.1.6"
        compile ":dalliance-plugin:0.1-SNAPSHOT"
        build ":tomcat:$grailsVersion"
        build ":build-info:1.1"
		runtime ":prototype:1.0"
		runtime ":jquery:1.7.1"
        runtime ":transmart-core:1.0-SNAPSHOT"
        runtime ":resources:1.2"

        test ":code-coverage:1.2.6"
    }
}

/* For development, it's interesting to use the plugins in-place.

 * This allows the developer to put the grails.plugin.location.* assignments
 * in an out-of-tree BuildConfig file if they want to.
 * Snippet from https://gist.github.com/acreeger/910438
 */
def buildConfigFile = new File("${userHome}/.grails/${appName}Config/" +
        "BuildConfig.groovy")
if (buildConfigFile.exists()) {
    println "Processing external build config at $buildConfigFile"
    def slurpedBuildConfig = new ConfigSlurper().parse(buildConfigFile.toURL())
    slurpedBuildConfig.grails.plugin.location.each { k, v ->
        if (!new File(v).exists()) {
            println "WARNING: Cannot load in-place plugin from ${v} as that " +
                    "directory does not exist."
        } else {
            println "Loading in-place plugin $k from $v"
            grails.plugin.location."$k" = v
        }
        if (grailsSettings.projectPluginsDir?.exists()) {
            grailsSettings.projectPluginsDir.eachDirMatch(~/${k}.*/) {dir ->
                println "WARNING: Found a plugin directory at $dir that is a " +
                        "possible conflict and may prevent grails from using " +
                        "the in-place $k plugin."
            }
        }
    }
}

// vim: set et sw=4 ts=4:
